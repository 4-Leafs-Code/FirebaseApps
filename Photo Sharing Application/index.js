// Your web app's Firebase configuration
var firebaseConfig = {
    
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get element that is the input we will click to upload images
const uploadButton = document.querySelector('#upload-button')

// Get element that shows the progress of the image uploading action
const progressBar = document.querySelector('progress')

// imageFile is global so we can access it after it uploads
let imageFile

// Event listener for if upload image button is clicked and a file has been selected
uploadButton.addEventListener('change', (event) => {

	// Access the chosen file through the event
	let file = event.target.files[0];
	
	// Define a var just for the name of the file
	let name = event.target.files[0].name;

	// Create a storage reference to the database using the name of the chosen file
	let storageRef = firebase.storage().ref(name)

	// Attach the put method to the storageRef 
	storageRef.put(file).on("state_changed",
		snapshot => {
			let percentage = Number(snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0)
			progressBar.value = percentage
		},
		error => {
			console.log('error', error.message)
		},
		() => {

			// Once upload is complete make a second request to get the download URL
			storageRef.put(file).snapshot.ref.getDownloadURL()
				.then((url) => {
					// We now have the uploaded url 
					console.log(url);

					// Every time we upload a image we also need to add a reference to the database
					firebase.firestore().collection('images').add({
						url: url
					})
					.then(success => console.log(success))
					.catch(error => console.log(error))

					// reset the progress bar to zero percent after one second
					setTimeout(() => {
						progressBar.removeAttribute('value')
					}, 1000)
				})
		})
})

// listen to database in the images collection. Loop through returned data to create image elements
firebase.firestore().collection('images').onSnapshot(snapshot => {
	document.querySelector('#images').innerHTML = ""
	snapshot.forEach(each => {
		console.log(each.data().url);
		let div = document.createElement('div')
		let image = document.createElement('img')
		image.setAttribute('src', each.data().url)
		div.append(image)
		document.querySelector('#images').append(div)
	})
})

// Remove all images
document.querySelector('#clear').addEventListener('click', () => {
	// Step 1
	firebase.firestore().collection("images")
	.get()
	// Step 2 (if success)
    .then(function(snapshot) {
		// Step 3
        snapshot.forEach(function(doc) {
			firebase.firestore().collection("images").doc(doc.id).delete()
			// Step 4 (if success)
			.then(function() {
				console.log("Document successfully deleted!");
			})
			// Step 4 (if error)
			.catch(function(error) {
				console.error("Error removing document: ", error);
			});
        });
	})
	// Step 2 (if error)
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
})