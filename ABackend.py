from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import threading
import time
import random
import mysql.connector
from FrontEndFunctions import get_random_movie,get_movie_data,load_prev_movie

app=Flask(__name__)
#remember to change the passwordChange to change password forever, right now it is temprorary and resets on server restart

CORS(app)

@app.route("/3000", methods=["POST"])
def handling_data():
    data = request.get_json()  # Get JSON data from the request
    type= data.get('type')
    # Establish the connection
    connection = mysql.connector.connect(
        host="localhost",        # Your host, e.g., localhost or AWS RDS instance
        user="root",    # Your MySQL username
        password="Sandhu57628136$",# Your MySQL password
        database="newdata" # The database you want to connect to
    )
    cursor = connection.cursor()
    if connection.is_connected():
        print("COnnection successful")
    else:
        print("Connection failed")
    
    
    if (type== "signin"):
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        if(email == True):
            select_query = """
            SELECT email_hash, password_hash FROM users WHERE email_hash = %s and password_hash = %s;
            """
            cursor.execute(select_query, (username, password))
            result = cursor.fetchone()
            cursor.close()
            # Close the connection when done
            connection.close()
            if result is None:
                return jsonify({"status": "failure", "message": "Sign in failed, email does not exist or password is incorrect"})
            else:
                return jsonify({"status": "success", "message": "Sign in with email successful"})
        elif(email == False):
            select_query = """
            SELECT username_hash, password_hash FROM users WHERE username_hash = %s and password_hash = %s;
            """
            cursor.execute(select_query, (username, password))
            result = cursor.fetchone()
            cursor.close()
            # Close the connection when done
            connection.close()
            
            if result is None:
                return jsonify({"status": "failure", "message": "Sign in failed, username does not exist or password is incorrect"})
            else:
                return jsonify({"status": "success", "message": "Sign in successful"})
        else:
            return jsonify({"status": "failure", "message": "Sign in failed, due to an error on our end please make a ticket or send an email to arsh.singh.sandhu1@gmail.com"})
    elif (type == "register"):
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        select_query_email = """
        SELECT email_hash from users WHERE email_hash = %s;
        """
        cursor.execute(select_query_email, [email])
        result = cursor.fetchone()
        if result is not None:
            return jsonify({"status": "failure", "message": "Sign up failed, email is already used"})
        select_query_user = """
        SELECT username_hash from users WHERE username_hash = %s;
        """
        cursor.execute(select_query_user, [username])
        result = cursor.fetchone()
        if result is not None:
            return jsonify({"status": "failure", "message": "Sign up failed, username is already used"})
        
        insert_query = """
        INSERT INTO users (username_hash, password_hash, email_hash)
        VALUES (%s, %s, %s);
        """
        cursor.execute(insert_query, (username, password, email))
        


        connection.commit()
        cursor.close()
        # Close the connection when done
        connection.close()
        return jsonify({"status": "success", "message": "Account created!"})
    elif (type == 'changePassword'):
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        
        if email == True:
            update_query = """
            UPDATE users
            SET password_hash = %s
            WHERE email_hash = %s;
            """
            cursor.execute(update_query, (password, username))
            connection.commit()
            cursor.close()
            # Close the connection when done
            connection.close()
            rows_affected = cursor.rowcount
            if rows_affected==0:
                return jsonify({"status": "failure", "message": "Change password failed, email does not exist"})
            else:
                return jsonify({"status": "success", "message": "Password changed!"})
        else:
            update_query = """
            UPDATE users
            SET password_hash = %s
            WHERE username_hash = %s;
            """
            cursor.execute(update_query, (password, username))
            connection.commit()
            cursor.close()
            # Close the connection when done
            connection.close()
            rows_affected = cursor.rowcount
            print(f"Rows affected: {rows_affected}")
            if rows_affected==0:
                return jsonify({"status": "failure", "message": "Change password failed, username does not exist"})
            else:
                return jsonify({"status": "success", "message": "Password changed!"})
    elif (type == 'LetterUser'):

        movie=get_random_movie(data.get('username'))
        if movie == "This user does not exist" or movie == "User has nothing in wishlist":
            return jsonify({"status": "failure", "message": movie})
        
        movie_link = 'https://letterboxd.com/film/'+movie
        emailExists=(data.get('emailExists'))
        account=(data.get('account'))
        data,result=get_movie_data(movie_link,emailExists,account,cursor,connection)
        return jsonify({"status":"success", "message": movie, "data":data,"result":result})
    elif(type == "LoadPrevMovie"):
        emailExists = data.get('emailExists')
        account = data.get('account')
        movieID = data.get('movieID')
        load_prev_movie(movieID,emailExists,account,cursor,connection)
        return jsonify({"status":"success", "message": "not finished"})
    else:
        return jsonify({"status": "failure", "message": "Sign up failed, due to an error on our end please make a ticket or send an email to Arsh.singh.sandhu1@gmail.com"})
    



           
        
if __name__ == "__main__":
    print("started")
    app.run(debug=True)


#create a linked list


