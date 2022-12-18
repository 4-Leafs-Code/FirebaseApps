# Who is chatting#
In order to have an effective chat application, we need a way to tie each message to the person who is sending it. To do that we will ask each user for their name.   

## Prompt for Name
This is some JavaScript logic that prompt a user for their name. This simulates an authentication experience without actually authenticating the user. Full user authentication using Firebase is covered in a later section of the course.   

With JavaScript, we check to see if the key of name is in localStorage. If there is not a name then we ask for it with the browsers built-in prompt. Then, after we have the name supplied by the user we can store it to localStorage. If there is a name in localStorage before we load the page we use that for our app. This would happen if you supplied your name earlier, closed the app, then returned later. localStorage would remember what name you had supplied previously.   

```javascript
if (!localStorage.getItem('name')) {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
} else {
	name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name
```

## Change Name
Let’s allow our users to replace the name saved in localStorage with a new one if they want to. We create a click event on the element with the id change-name. Once clicked they will get a prompt asking for their name. We take the value for that prompt and store it in localStorage ith the key of name.

```javascript
document.querySelector('#change-name').addEventListener('click', () => {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
	document.querySelector('#name').innerText = name
})
```
```html
<div id="container">
	<div id="user-options">
		<div>Hi, <span id="name"></span></div>
		<div id="change-name">change name</div>
	</div>
</div>
```

## Saving Messages to the Database
I show this Firebase query to you now in a raw form so you can see it in its most basic structure.

This code will add a message to a collection called messages. If the collection doesn’t exist already, it will create it.


```javascript
db.collection('messages')
	.add({
		name: 'John Doe',
		message: 'Hello world!' 
	})
	.then(function (docRef) {
		console.log(`Document written with ID: ${docRef.id}`);
	})
	.catch(function (error) {
		console.error(`Error adding document: ${error}`);
	});

```
## Form for New Messages
In the form, we will have one input for new messages which is how we will take information from our users.

```html
<form id="message-form">
	<input type="text" id="message-input" placeholder="message" required>
	<button class="orange-button">send</button>
</form>
```

## Form Event Listener
Let’s take a look at the code that will make up the form and the event listener that will listen for the submit event of that form.

```javascript
document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault();
})
```

## Get Form Values#
Inside the event listener, you can access the values of the form.

```javascript
document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault();
	let message = document.querySelector('#message-input').value 
})
```

## Saving to the Database
The last step is taking the form value and placing it into a Firestore query. The query, which I showed you previously, should be placed in the event listener.

```javascript
document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault();
	let message = document.querySelector('#message-input').value 
	db.collection('messages')
	.add({
		name: name,
		message: message
	})
	.then((docRef) => {
		console.log(`Document written with ID: ${docRef.id}`);
		document.querySelector('#message-form').reset()
	})
	.catch((error) => {
		console.error(`Error adding document: ${error}`);
	});
})
```

## Styling Elements#
Let’s give our chat app some basic styling with CSS.

```javascript
body{
    font-family: sans-serif;
    color: #666;
}

#container{
    max-width: 400px;
    margin: auto;
}

#user-options{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin: 40px 0px 15px 0px;
}

#change-name{
    text-align: right;
    color: #0fabbc;
    font-size: 10px;
    cursor: pointer;
}
input{
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #CCC;
    width: 100%;
    margin-bottom: 10px;
    box-sizing:border-box
}

input:focus{
    outline: none;
}

.name{
    font-size: 11px;
    font-weight: 700;
}

#name{
    font-style: italic;
    font-weight: 600;
}

button{
    color: #fff;
    width: 100%;
    text-align: center;
    border: 0px;
    border-radius: 10px;
    padding: 10px 0px 10px 0px;
    font-size: 16px;
    outline: 0;
    cursor: pointer;
}

.orange-button{
    background-color: #ffbd69 ;
	box-shadow: 0 4px #d19c57;
}

.orange-button:hover{
    box-shadow: 0 2px #d19c57;
}
```