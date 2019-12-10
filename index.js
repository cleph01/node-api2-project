// implement your API here
const express = require('express'); // import the express package

//import database
const db = require('./data/db.js');

const server = express(); // creates the server

//Using some middleware to parse request body if its JSON
server.use(express.json());




// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
  
    res.send('Welcome to My API2 Home Page');
    
  });


//Creates a user using the information sent inside the request body.
server.post('/api/posts', (req, res) => {
    
    const { title, contents } = req.body

    if (!title || !contents ){
        return res.status(400).json({"error": "Please provide title and contents for the post"})
      }
    
    // res.send(newUser)

    db.insert(req.body)
      .then(response => {
        res.status(201).json(response)
      })
      .catch(err => {
        res.status(500).json({message: "There was an error while saving the post to the database"})
      })

  });


//Creates a comment for the post with the specified id using information 
//sent inside of the request body.
server.post('/api/posts/:id/comments', (req, res) => {
    
    const post_id = req.params.id

    const comments = req.body

    
    if (!comments.text ){
        return res.status(400).json({errorMessage: "Please provide text for the comment."})
      }



    db.findById(post_id)
      .then(response => {
        
        if(response.length != 0){

            db.insertComment(comments)
                .then(response => {
                    res.status(201).json(comments)
                })
                .catch(err => {
                    res.status(500).json({error: "There was an error while saving the comment to the database" })
                })

        }else{

            res.status(404).json({error: "The post with the specified ID does not exist."})
        }
        
      })
      .catch(err => {
        res.status(404).json({err})
      })

  });


// Returns an array of all the post objects contained in the database.
server.get('/api/posts', (req, res) => {
    
    db.find()
      .then(response => {
        res.json(response)
      })
      .catch(err => {
        res.status(500).json({message: "The posts information could not be retrieved."})
      })
  
  });


 //	Returns the post object with the specified id.
 server.get('/api/posts/:id', (req, res) => {
  
    db.findById(req.params.id)
      .then(response => {

        if(response.length != 0){
            res.json(response)
        }else{
            res.status(404).json({message: "The post with the specified ID does not exist." })
        }
        
      })
      .catch(err => {
        res.status(500).json({error: "The post information could not be retrieved." })
      })

});


//Returns an array of all the comment objects associated with the post 
//with the specified id.
server.get('/api/posts/:id/comments', (req, res) => {
  
    db.findPostComments(req.params.id)
      .then(response => {

        if(response.length != 0){
            res.json(response)
        }else{
            res.status(404).json({message: "The post with the specified ID does not exist." })
        }

      })
      .catch(err => {
        res.status(500).json({error: "The comments information could not be retrieved."})
      })

});


//Removes the post with the specified id and returns the deleted post object. 
//You may need to make additional calls to the database in order to satisfy 
//this requirement.
  server.delete('/api/posts/:id', (req, res) => {
    
    const id = req.params.id

    db.findById(id)
        .then(response => {

            if(response.length != 0){

                db.remove(id)
                .then(response => {
                    res.status(201).json(response)
                })
                .catch(err => {
                    res.status(500).json({error: "The post could not be removed." })
                })
            }else{
                res.status(404).json({message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({error: "The post could not be removed." })
        })
  });


//Updates the user with the specified id using data from the request body. 
//Returns the modified document, NOT the original.
  server.put('/api/posts/:id', (req, res) => {
    
    const post_id = req.params.id

    const { title, contents }  = req.body

    
    if (!title || !contents ){
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
      }

    
    db.findById(post_id)
        .then(response => {

            if(response.length != 0){

                db.update(post_id, req.body)
                .then(response => {
                    res.status(200).json(response)
                })
                .catch(err => {
                    res.status(500).json({error: "The post information could not be modified." })
                })
            }else{
                res.status(404).json({message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({err })
        })

    


  });


const port = 5000;

const host = "127.0.0.1";

// watch for connections on port 5000
server.listen(port, host, () =>
  console.log('Server running on http://localhost:5000')
);