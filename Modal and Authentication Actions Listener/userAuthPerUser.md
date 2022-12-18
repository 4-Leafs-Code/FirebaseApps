# User Authorization Primer
Now that we have completely authenticated our user, it is now possible to implement authorization.

## What is User Authorization?
Authorization is a security mechanism used to determine user/client privileges or access levels related to system resources, including computer programs, files, services, data, ​and application features. Authorization is normally preceded by authentication for user identity verification.

## Types of Authorization
### user-based
User-based authorization allows users to create, read, update, or delete their own data.

### role-based
Role-based authorization occurs when you set up levels of access for different users. For example, an admin role might be able to access or delete anyone’s information. A manager of a department store might have a role that allows him or her to see only their sales, refunds or other types of information that are appropriate for that role to see.

## Building the To-Do List Application
For our application, we will use Firestore Security rules to provide access control. This allows us to build user-based access systems that keep our users’ data safe. This course focuses on user-based authorization because it’s the easiest to implement.

## User-based Security in To-do List
This type of authorization allows a user to be able to read, write or delete items from​ lists that were created by them. They would not be authorized to read, write or delete items from​ any list created by someone else.

## Taking Your First Step in user-based Security
Ready to protect your app against hackers? The first step is to add items to the database but also specify which user added them. We will do that in the next lesson!

## Enable Cloud Firestore
Start by initializing Cloud Firestore in your project. When doing this, please remember that you need to set your security rules to test mode. This was covered in the second section of this course if you need a refresher. I will show you how to secure the database in the upcoming lesson Cloud Firestore security.

## To-do List Item Form
We create a form that will add to-do items.

```html
<!-- Dashboard -->
<div id="dashboard" class="hide-when-signed-out">

    <div>
        <form id="to-do-list-form">
            <h1>New task</h1>
            <input type="text" id="item" placeholder="Task" , required autocomplete="off">
            <button type="submit">Add</button>
        </form>
    </div>

    <div>
        placeholder
    </div>

    <div>
        <div id="account">
            <h1>Account</h1>
            <button class="auth" auth="sign-out">sign out</button>
        </div>
    </div>

</div>
```
###### css
```html 
#to-do-list-form > button {
max-width: 150px;
margin-top: 30px;
}
```

## Container For to-do Items#
We create an HTML div element that will serve as your injection point for all of your to-do items. We give it an ID of to-do-list-items.

```html 
<!-- Dashboard -->
<div id="dashboard" class="hide-when-signed-out">

    <div>
        <form id="to-do-list-form">
            <h1>New task</h1>
            <input type="text" id="item" placeholder="Task" , required autocomplete="off">
            <button type="submit">Add</button>
        </form>
    </div>

    <div>
        <h1>To do list</h1>   //add this
        <div id="to-do-list-items"></div>  //add this
    </div>

    <div>
        <div id="account">
            <h1>Account</h1>
            <button class="auth" auth="sign-out">sign out</button>
        </div>
    </div>

</div>
```

## Real-time Listener for to-do Items
Setting up the real-time listener right now is a good idea because once to-do items are added, we will see them immediately. We are going to place this real-time listener in the authentication state listener because the script will run once a user is authenticated. We need to know who the user is in order to make this work.

### Generate to-do Items#
As we loop through our collection, my-list, we will create a paragraph and fill it with text from each document.

```javascript
db.collection('to-do-lists').doc(uid).collection('my-list')
		.onSnapshot(snapshot => {
			document.getElementById('to-do-list-items').innerHTML = '';
			// loop throug all document in the my-list collection
			snapshot.forEach(element => {
				// creat a paragraph for each item
				let p = document.createElement('p');
				// fill the paragrahp with the text of the to-do
				p.textContent = element.data().item;
				// append the paragraph as they are made to the DOM using the element 'to-do-list-items'
				document.getElementById('to-do-list-items').appendChild(p);
			});
		});
```

### Access to-do Item Add Form
Before we can add items, we will need to get access to the form HTML element with the id of to-do-list-form.

```javascript
// Get the to do list form for item submissions
const toDoListForm = document.getElementById('to-do-list-form');
```

## Submit Event and Database Entry#
In earlier lessons, we covered submit events and database entries. The only difference with the following code is that it’s adding a document and setting the key of the new document as the UID of the user who stores it.

```javascript
// Add to-do item submit event
toDoListForm.addEventListener('submit', event => {
	event.preventDefault()
	// Send value to Firebase
	db.collection('to-do-lists').doc(uid).collection('my-list').add({
		// Grab value from from form
		item: document.getElementById('item').value,
	});
	// reset form
	toDoListForm.reset()
});
```

# Deleting Completed Items
In this lesson, we will add ​the ability to delete items from the list in the application once the "to do" tasks have been completed.

## Create Buttons Dynamically for Each Item
Remember when we looped through our collection of items and placed each to-do inside a paragraph tag, then appended that to a container element? We are going to create buttons inside that loop with a similar method. We use JavaScript to dynamically create them and add the attribute of data to each one, which will hold the id of that item. We will use a click event to read that attribute and delete the correct item.

```javascript
database.collection('to-do-lists').doc(uid).collection('my-list')
		.onSnapshot(snapshot => {
			document.getElementById('to-do-list-items').innerHTML = '';
			snapshot.forEach(element => {
				let p = document.createElement('p');
				p.textContent = element.data().item;
				let deleteButton = document.createElement('button');
				deleteButton.textContent = 'x';
				deleteButton.classList.add('delete-button');
				deleteButton.setAttribute('data', element.id);
				p.appendChild(deleteButton);
				document.getElementById('to-do-list-items').appendChild(p);
			});
		});
```

## Set up the Event Listener and Firestore Query#
We make an event listener for the delete buttons. When a button is clicked, we make a delete query to Firestore to delete that item based on the item’s ID.

```javascript
// Delete a to do list item
document.body.addEventListener('click', event => {
	if (event.target.matches('.delete-button')) {
		key = event.target.getAttribute('data');
		database.collection('to-do-lists').doc(uid).collection('my-list').doc(key).delete();
	};
});
```

## Style the Delete Button
All we need for the delete button is a little margin on the left side of it to separate it from our to-do text.

```html
.delete-button{
	margin-left: 20px;
}
```

# Cloud Firestore Security
In this lesson, we will edit security rules so that only authorized users can make a 'write' request. This protects you​ from potential hackers.

## Change Your Rules
For your to-do list, we can set our rules like you see below so that the user who is signed in only has read and write access to their specific list of to-do items.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /to-do-lists/{listUID}/{document=**}{
     allow read, write: if request.auth.uid == listUID
    }
  }
}
```
## Let’s Break This Down#
### Match the Database
Where you see the match /databases/{database}/documents {} is the starting point for any rule you want to add. You can add as many rules as you want between the {}.

### Match the List
Inside that you see match /to-do-lists/{listUID}/{document=**}{} where inside the {} is where we will define access levels for lists.

Now check out the {listUID}. This is a wild card basically saying give us access to any list no matter what the ID. If you wanted to give access to a specific list, you could put an actual ID there like this {WMPlOss0AxQr3xLspfQPJFXqwwu2}.

### Define Who Can do What
At the inner part of the code, you see allow read, write: if request.auth.uid == listUID, meaning that if your UID matches the list ID, then you can read, and write to that list. The list ID will match up with a user because we made the list ID the UID of the signed-in user for this very purpose. Remember the query that looks like this when we add a to-do item database.collection('to-do-lists').doc(uid).collection('my-list').add({}). You can see that we name the doc after the signed-in users UID by doing this .doc(uid). This is how the magic happens!

### Your Lists are Secure
Your user’s lists are now 100% secure because of the rules we implemented. If someone has your publicly available Firebase keys, they are not able to do anything with them that would affect your application.