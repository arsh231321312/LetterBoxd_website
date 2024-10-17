from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import threading
import time
import random
import mysql.connector
def load_prev_movie(movieID,emailExists,account,cursor,connection):
    select_query = """
    SELECT director,title,releaseYear,rating,tagline,movie_description,poster_url,trailer,wheretowatch FROM movies
    WHERE movieID=%s
    """
    cursor.execute(select_query,[movieID])
    result=cursor.fetchall()
    if result:
        result=result[0]
    
    print(result)
    if emailExists:        
        pass
    else:
        pass
    cursor.close()
    connection.close()
    pass
def get_movie_data(movie_link,emailExists,account,cursor,connection):


    response = requests.get(movie_link)
    soup = BeautifulSoup(response.content, 'html.parser')
    id=soup.find('p',class_="text-link text-footer")
    id=soup.find_all('a',class_="micro-button track-event")
    id=str(id[-1].get('href').split('/')[-2])
	
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
        url=""
        posterImg=""
    else:
        # print(poster[1].get('href'))
        url=str(poster[-1].get('href'))
        

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
    if emailExists:
        select_query_user = """
        SELECT movie_id from users WHERE email_hash = %s;
        """
    else:
        select_query_user = """
        SELECT movie_id from users WHERE username_hash = %s;
        """

    cursor.execute(select_query_user, [account])
    result = cursor.fetchone()
    
    
    if result==None or result[0] is None:
        result=[]
    else:   
        result=result[0].split(',')
    if (str(id)) in result:
        result.remove(str(id))
    if len(result)>19:
        result.pop(0)
    result.append(str(id))
    print("length")
    print(len(result))
    print(id)
    string=(",".join(result))
    print(string)
    if emailExists:
        update_query = """
        UPDATE users SET movie_id = %s WHERE email_hash = %s;
        """
    else:
        update_query = """
        UPDATE users SET movie_id = %s WHERE username_hash = %s;
        """
    
    cursor.execute(update_query, [string, account])
    select_query = """
    SELECT * FROM movies where movieID=%s;
    """
    cursor.execute(select_query, [str(id)])
    
    r=cursor.fetchall()
    if len(r)==0:
        insert_query="""
        insert into movies (movieID,director,title,releaseYear,rating,tagline,movie_description,poster_url,trailer,wheretowatch)
        values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
        """
        cursor.execute(insert_query,[str(id),str(director),str(title),str(year),str(rating),str(tagline),str(description),str(posterImg),str(href),str(link)])
    connection.commit()
    
    result=result[::-1]
    for i in range(len(result)):
        mvID=int(result[i])

        select_query = """
        SELECT poster_url,title FROM movies WHERE movieID=%s;
        """
        cursor.execute(select_query, [str(mvID)])
        tup=cursor.fetchall()
        

        picture,titleMovie = tup[0]
        if picture==None:
            picture=""
        if titleMovie==None:
            titleMovie=""

        result[i]=[picture,titleMovie,str(mvID)]

        
    cursor.close()
    connection.close()
    return data,result
    

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
