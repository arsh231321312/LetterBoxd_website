from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import threading
import time
import random
import mysql.connector
def get_movie_data(movie_link,emailExists,account):


    response = requests.get(movie_link)
    soup = BeautifulSoup(response.content, 'html.parser')
    #description = soup.find('div', class_='film-poster')
    head = soup.find('head')
    # Check if the request was successful
    
    director=""
    backgroundImage=""
    title=""
    rating=""
    tagline=""
    description=""
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        # Find the div by class and ID
        head = soup.find('head')
        backgroundImage=head.find('meta',attrs={'property': 'og:image'})
        director=head.find('meta',attrs={'name': 'twitter:data1'})
        rating=head.find('meta',attrs={'name': 'twitter:data2'})
        theme=head.find('meta',attrs={'name':'theme-color'})
        # <meta name="theme-color" content="#14181C">
        if rating==None:
            rating="Not enough ratings"
        else:
            rating=str(rating['content'])
        tagline=soup.find('h4',class_='tagline')
        if tagline==None:
            tagline = ""  
        else:
            tagline=str(tagline.text)
        description=head.find('meta',attrs={'name': 'twitter:description'})
        titleDetails=soup.find('section',class_='film-header-group')
        title=titleDetails.find('span',class_='name js-widont prettify')

        if backgroundImage==None:
            backgroundImage=""
        else:
            backgroundImage=str(backgroundImage['content'])
        if title==None:
            title=""
        else:
            title=str(title.text)
        
        if director==None:
            director=""
        else:
            text=" Directed by "
            director=str(director['content'])
            text+=director
        title+=text
        if description==None:
            description=""
        else:
            description=str(description['content'])
        if theme==None:
            theme=""
        else:
            theme=str(theme['content'])
        
        


        print(backgroundImage)
        print(title)
        print(rating)
        print(tagline)
        print(description)

    
    titleDetails=soup.find('section',class_='film-header-group')
    year=titleDetails.find('div',class_='releaseyear')
    year=year.find('a').text
    titleDetails=titleDetails.find('span',class_="name js-widont prettify")
    
    # director=titleDetails.find('div',class_='metablock')
    # director=director.find('span',class_='prettify')
    # print(director.text)
    print(year)
    
    
    div = soup.find('div', class_='col-6 gutter-right-1 col-poster-large', id='js-poster-col')
    video=div.find('div',class_='header')
    video=video.find('a',class_='play track-event js-video-zoom')
    if video!=None:
        href=video.get('href')
    else:
        href=""
    name=titleDetails.text.replace(' ','-').lower()
    link='https://letterboxd.com/film/'+name+'/watch/'
    print(link)
    print(href)
    
    

    poster = soup.findAll('a', class_='micro-button track-event')
    if poster==None:
        poster=["",""]
    # print(poster[1].get('href'))
    url=str(poster[1].get('href'))
    

    # Send a GET request to the URL
    response = requests.get(url)
    print(response)
    posterImg=""
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        # Find the div by class and ID
        div_content=soup.find('div',class_='blurred')
        div_content=div_content.find('img')
        div_content=div_content.get('src')
        # Print the div content
        if div_content==None:
            div_content = "No content found"
        print(div_content)
        posterImg=str(div_content)
    data={
        "theme" :theme,
        "background": backgroundImage,
        "director" : director,
        "title" : title,
        "releaseYear" : year,
        "rating" : rating,
        "tagline" : tagline,
        "description": description,
        "posterImg" : posterImg,
        "trailer" : href,
        "whereToWatch" : link
        
    }
    print(emailExists)
    print(account)
    return data
    

def get_random_movie(userLetterboxd):
    # URL of the page you want to scrape
    #url = 'https://letterboxd.com/Arsh_Sandhu/watchlist/'
    #url = 'https://letterboxd.com/davyiu/watchlist/'
    lists=[]
    # Send a GET request to the URL
    def grabPage(url,pageNum=1):
        

        newurl=url+f'{pageNum}/'
        response = requests.get(newurl)

        soup = BeautifulSoup(response.content, 'html.parser')
            
        ul_element = soup.find('ul', class_='poster-list -p125 -grid -scaled128')
        
        if ul_element:
            new_elements = soup.find_all('li',class_ = 'poster-container')
                
            if new_elements:

                for element in new_elements:
                    tag = element.find('div')
                        
                    film_slug = tag.get('data-film-slug')
                    if film_slug:

                        lists.append(film_slug)

    genre_choices = {'1':'action','2':'adventure','3':'animation','4':'comedy','5':'crime','6':'documentary','7':'drama','8':'family','9':'fantasy','10':'history','11':'horror','12':'music','13':'mystery','14':'romance','15':'science-fiction','16':'thriller','17':'tv-movie','18':'war','19':'western'} 
    # choice = input("Do you want a genre, Yes-Y    No-N\n")
    get_genre=0
    choice = 'N'
    if choice[0].capitalize() == 'Y':
        get_genre = input("1:'Action'\t2:'Adventure'\t3:'Animation'\n4:'Comedy'\t5:'Crime'\t6:'Documentary'\n7:'Drama'\t8:'Family'\t9:'Fantasy'\n10:'History'\t11:'Horror'\t12:'Music'\n13:'Mystery'\t14:'Romance'\t15:'Science Fiction'\n16:'Thriller'\t17:'Tv Movie'\t18:'War'\n19:'Western'\n")

    url = 'https://letterboxd.com/'
    url+=userLetterboxd
    url+='/watchlist/'

    if get_genre in genre_choices:
        url+='genre/'+genre_choices[get_genre]+'/'

    response = requests.get(url)
    if(response.status_code != 200):
        print("This user does not exist")
        return "This user does not exist"
    soup = BeautifulSoup(response.content, 'html.parser')
    page = soup.find_all('li',class_='paginate-page')
        
    if len(page)!=0:
        page_number = int(page[-1].a.text.strip())
    else:
        page_number=1

    url+='page/'
    grabPage(url,random.randint(1,page_number))
    # Create and start threads
    


    # Wait for all threads to complete
    
    if len(lists)==0:
        print("User has nothing in wishlist")
        return "User has nothing in wishlist"
    return (random.choice(lists))

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
        password="###########",# Your MySQL password
        database="############" # The database you want to connect to
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
        data=get_movie_data(movie_link,emailExists,account)
        return jsonify({"status":"success", "message": movie, "data":data})
    else:
        return jsonify({"status": "failure", "message": "Sign up failed, due to an error on our end please make a ticket or send an email to"})
    



           
        
if __name__ == "__main__":
    print("started")
    app.run(debug=True)
