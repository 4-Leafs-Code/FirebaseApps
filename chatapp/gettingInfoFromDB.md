## How to Get Data From Firebase Cloud Firestore
Be aware that the example code you see below is very short. It may look weird at first but you will quickly get used to it and appreciate how easy it is to implement as you learn more about Firebase.

Using only a few lines of code, we can make a real-time connection to our database!

```javascript
// listen to the collection of friends
db.collection("friends")
.onSnapshot(function(snap) {
// comes back in a way that is iterable with a forEach() loop
	snap.forEach(function(doc) {
		// doc.data() is each document coming from the friends collection
		console.log(doc.data());
	});
});
```

There is no step two! We defined the endpoint to query from our front-end while also making an asynchronous request. This also keeps the line of communication open, so if your database changes, all connected clients will be updated without needing to make another request.

## Using the where Clause
To specify what we want back from Cloud Firestore, we make use of the “where” clause.

```javascript
	db.collection("friends")
    // By adding the "where" clause we have control over what data comes back
	.where('name', '==', 'Eric')
    .onSnapshot(function(snap) {
        snap.forEach(function(doc) {
            console.log(doc.data());
        });
    });
    ```