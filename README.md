# YELP CAMP

This is a Web Application developed using Node JS as a project for the Udemy Course - [The Web Developer Bootcamp by Colt Steele](https://www.udemy.com/the-web-developer-bootcamp/)

## Live Hosting

To see the live hosting of this application, please visit [https://yelpcamp-gauravthantry.herokuapp.com/](https://yelpcamp-gauravthantry.herokuapp.com/)

## Features

* Registration:
  
  * User ID

  * User Email ID (Verification link will be sent to this ID)

  * Password

* Authentication
 
  * User Login with user name and password

  * Users can also reset their password

* Authorization

  * User cannot manage posts or comments without being logged in

  * User can add posts and comments once logged in

  * User cannot modify or delete posts or comments that does not belong to him/her

* Managing campground posts

  * Create, edit and delete posts and comments

  * Upload campground photos 

  * Search existing campgrounds

* Flash messages responding to users interaction with the app

* Responsive Web Design

### Clone or download this repository

```sh
git clone https://github.com/gauravthantry/yelpcamp
```

### Install dependencies

```sh
npm install
```

or

```sh
yarn install
```

### Comments in code

Some comments in the source code are course notes and therefore might not seem necessary from a developer's point of view.

## Built with

### Front-end

* [ejs](http://ejs.co/)
* [Google Maps APIs](https://developers.google.com/maps/)
* [Bootstrap](https://getbootstrap.com/docs/3.3/)

### Back-end

* [express](https://expressjs.com/)
* [mongoDB](https://www.mongodb.com/)
* [mongoose](http://mongoosejs.com/)
* [crypto](https://nodejs.org/api/crypto.html#crypto_crypto)
* [express-session](https://github.com/expressjs/session#express-session)
* [method-override](https://github.com/expressjs/method-override#method-override)
* [nodemailer](https://nodemailer.com/about/)
* [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)





