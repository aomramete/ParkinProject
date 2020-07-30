from flask import Flask, request, jsonify, json
from flask_restful import Resource, Api
from flask_cors import CORS
from math import sin, cos, sqrt, atan2, radians
from datetime import datetime,timedelta
import random
import json
import requests
from flaskext.mysql import MySQL
import firebase_admin
import pyrebase
import json
from firebase_admin import credentials, auth
from functools import wraps
from google.oauth2 import id_token
from google.auth.transport import requests

app = Flask(__name__)
mysql = MySQL()

cred = credentials.Certificate('fbAdminConfig.json')
firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('fbconfig.json')))
CORS(app)

app.config['MYSQL_DATABASE_USER'] = 'XXXX' # Change this!
app.config['MYSQL_DATABASE_PASSWORD'] = 'XXXX' # Change this!
app.config['MYSQL_DATABASE_DB'] = 'XXXX' # Change this!
app.config['MYSQL_DATABASE_HOST'] = 'XXXX' # Change this!

mysql.init_app(app)

def check_token(f):
    @wraps(f)
    def wrap(*args,**kwargs):
        if not request.headers.get('authorization'):
            return {'message': 'No token provided'},400
        try:
            token = request.headers['authorization']
            print(token)
            id_info = id_token.verify_oauth2_token(token, requests.Request(), 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
            if id_info['iss'] != 'https://accounts.google.com':
                raise ValueError('Wrong issuer.')
            userid = id_info['sub']
            useremail = id_info['email']
            username = id_info['name']
        except:
            return {'message':'Invalid token provided.'},401
        return f(*args, **kwargs)
    return wrap

@app.route('/api/signup', methods = ['POST'])
def signup():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    if email is None or password is None:
        return {'message': 'Error missing email or password'},400
    try:
        user = auth.create_user(
               email=email,
               password=password
        )
        return {'message': 'Successfully created user {user.uid}'},200
    except:
        return {'message': 'Error creating user'} , 400
        
@app.route('/api/token', methods = ['POST'])
def token():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    try:
        user = pb.auth().sign_in_with_email_and_password(email, password)
        jwt = user['idToken']
        return {'token': jwt}, 200
    except:
        return {'message': 'There was an error logging in'},400

@app.route('/api/userinfo')
@check_token
def userinfo():
    return {'data': "secret"}, 200

@app.route('/api/v1/registMeter', methods = ['POST'])
@check_token
def posttoDB():
    con = mysql.connect()
    data = request.get_json()
    if len(data) != 6:
        return {"Status":"Bad Request"}, 400
    cur = con.cursor()
    cur.execute("insert into meterData(meter_Name,meter_Lat, meter_Lon, status, price,URLimage) values ('{0}',{1},{2},{3},{4},'{5}')".format(data["meter_Name"],data["meter_Lat"],data["meter_Lon"],data["status"],data["price"],data["URLimage"]))
    con.commit()
    return {"Registered": "Successfully"} , 201

@app.route('/api/v1/editMeter/<meter_ID>', methods = ['PATCH'])
@check_token
def editMeter(meter_ID=None):
    con = mysql.connect()
    data = request.get_json()
    if len(data) != 6:
        return {"Status":"Bad Request"}, 400
    cur = con.cursor()
    cur.execute("UPDATE meterData SET meter_Name =%s, meter_Lat = %s, meter_Lon = %s, status = %s, price = %s, URLimage = %s WHERE meter_ID = %s;",(data["meter_Name"],data["meter_Lat"],data["meter_Lon"],data["status"],data["price"],data["URLimage"],meter_ID))
    con.commit()
    return {"Successfully": "Edited"} , 201

@app.route('/api/v1/delete/', methods = ['GET','POST'])
@check_token
def deletemeter():
    reserve_ID = request.args.get('rid')
    con = mysql.connect()
    data = request.get_json()
    cur = con.cursor()
    cur.execute("DELETE FROM reserveData2 WHERE reserve_ID = %s",reserve_ID)
    con.commit()
    return {"Meter":"Deleted"} , 201


@app.route('/api/v1/reservedata/', methods = ['GET'])
@check_token
def viewreserveData():
    uid = request.args.get('uid')
    cur = mysql.connect().cursor()
    cur.execute("SELECT m.meter_Name,m.URLimage,r.* FROM reserveData2 r JOIN meterData m ON m.meter_ID = r.meter_ID WHERE r.user_ID = %s", uid)
    data = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/api/v1/check/', methods = ['GET'])
@check_token
def passcodeCheck():
    meterid = request.args.get('mid')
    userType = request.args.get('pass')
    cur = mysql.connect().cursor()
    cur.execute("SELECT * FROM meterData WHERE meter_ID = %s",meterid)
    data = [dict((cur.description[i][0], value)
	for i, value in enumerate(row)) for row in cur.fetchall()]
    for j in data:
          if j["passcode"] == int(userType):
              return {"Passcode":"Correct"} , 201
          else:
              return {"Wrong":"Passcode"}, 402

@app.route('/api/v1/reservedataID/', methods = ['GET'])
@check_token
def viewreserveDataID():
    reserve_ID = request.args.get('id')
    cur = mysql.connect().cursor()
    cur.execute("SELECT m.meter_ID,m.meter_Name,m.URLimage,m.passcode,r.* FROM reserveData2 r JOIN meterData m ON m.meter_ID = r.meter_ID WHERE r.reserve_ID = %s", reserve_ID)
    data = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/api/v1/doReserve', methods = ['POST'])
@check_token
def doReserve():
    con = mysql.connect()
    data = request.get_json()
    fromdate = data["reserve_from"]
    todate = data["reserve_to"]
    cur = mysql.connect().cursor()
    cur.execute("SELECT count(*) as count FROM reserveData2 WHERE ((reserve_from BETWEEN %s AND %s) OR (reserve_to BETWEEN %s AND %s)) AND meter_ID = %s",(data["reserve_from"],data["reserve_to"],data["reserve_from"],data["reserve_to"],data["meter_ID"]))
    dataReserve = [dict((cur.description[i][0], value)
           for i, value in enumerate(row)) for row in cur.fetchall()]
    for j in dataReserve:
           if j["count"] != 0:
       	      return {"Time is conflicted.": "Please Choose available time."}, 401
           else:
              datefrom_cal = datetime.strptime(fromdate,'%Y-%m-%d %H:%M')
              dateto_cal = datetime.strptime(todate,'%Y-%m-%d %H:%M')
              time_delta = (dateto_cal - datefrom_cal)
              total_seconds = time_delta.total_seconds()
              minutes = total_seconds/60
              hrs = minutes/60
              if minutes == 0:
                return {"You Cannot choose the same" : "start and end time"}, 402
              elif minutes < 0:
                return {"Please":"Correct"}, 405
              cur = mysql.connect().cursor()
              cur.execute("SELECT * FROM meterData WHERE meter_ID = %s", data["meter_ID"])
              dataMeter = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
                for j in dataMeter:
    	           pricebase = j["price"]
                   priceMinute = float(pricebase/60)
                   data["deltaMinutes"] = minutes
                   data["deltaHours"] = hrs
                   priceFinal = minutes * priceMinute
                   data["Need2PAY"] = round(priceFinal,2)
    return data

@app.route('/api/v1/pay', methods = ['POST'])
@check_token
def doReservewithPay():
    con = mysql.connect()
    data = request.get_json()
    date_To = data["reserve_to"]
    date_From = data["reserve_from"]
    dateto_cal = datetime.strptime(date_To,'%Y-%m-%d %H:%M')
    datefrom_cal = datetime.strptime(date_From,'%Y-%m-%d %H:%M')
    present = datetime.now() + timedelta(hours=7)
    time_delta = (dateto_cal - present)
    time_delta1 = (datefrom_cal - present)
    total_sec = time_delta.total_seconds()
    total_sec1 = time_delta1.total_seconds()
    total = round(total_sec)
    itstime = round(total_sec1)
    before = total - 300
    cur = con.cursor()
    cur.execute("insert into reserveData2(meter_ID,user_ID, price,reserve_from,reserve_to) values ('{0}','{1}','{2}','{3}','{4}')".format(data["meter_ID"],data["user_ID"],data["Need2PAY"],data["reserve_from"],data["reserve_to"]))
    con.commit()
    data["reserveto"] = total
    data["before"] = before
    data["itstime"] = itstime
    return data

@app.route('/api/v1/allreserve')
@check_token
def viewAllreserve():
    cur = mysql.connect().cursor()
    cur.execute("SELECT * FROM reserveData2")
    data = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/api/v1/details/', methods = ['GET','POST'])
def filters():
    meterid = request.args.get('meterid')
    cur = mysql.connect().cursor()
    cur.execute("SELECT * FROM reserveData2 WHERE meter_ID = %s",meterid)
    data = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/api/v1/cancelReserve/<reserve_ID>', methods = ['POST'])
@check_token
def cancelReserve(reserve_ID=None):
    con = mysql.connect()
    data = request.get_json()
    cur = con.cursor()
    cur.execute("DELETE FROM reserveData2 WHERE reserve_ID = %s",reserve_ID)
    con.commit()
    return {"Canceled":"Reserve"} , 201

@app.route('/api/v1/meterData/<meter_ID>')
@check_token
def viewMeterByID(meter_ID=None):
    cur = mysql.connect().cursor()
    cur.execute("SELECT * FROM meterData WHERE meter_ID = %s",meter_ID)
    data = [dict((cur.description[i][0], value)
	for i, value in enumerate(row)) for row in cur.fetchall()]
    for coor in data:
        if coor["status"] == 0:
           coor["Status"] = "Available"
        elif coor["status"] == 1:
           coor["Status"] = "Full"
        elif coor["status"] == 2:
           coor["Status"] = "Out of Service"
    return jsonify(data)

@app.route('/api/v1/allmeter', methods = ['GET','POST'])
@check_token
def viewAllMeter():
    cur = mysql.connect().cursor()
    cur.execute("SELECT * FROM meterData")
    data = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/api/v1/reservedMeter/', methods = ['GET','POST'])
@check_token
def viewAllMeterbyDate():
    dateInput = request.args.get('date')
    cur = mysql.connect().cursor()
    cur.execute("SELECT DISTINCT m.meter_ID,m.meter_Name,m.URLimage,COUNT(reserve_from_time) as reservetime FROM meterData m LEFT JOIN reserveData r ON m.meter_ID = r.meter_ID AND r.reserve_from_Date = %s GROUP BY m.meter_ID", dateInput)
    data = [dict((cur.description[i][0], value)
              for i, value in enumerate(row)) for row in cur.fetchall()]
    for j in data:
       if j["reservetime"] == 0:
           j["reservetime"] = "No reservation found."
    return jsonify(data)

if __name__ == '__main__':
    app.run(threaded=True, debug=True)

