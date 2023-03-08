const express = require('express')
const router = express.Router();
const Post = require('../Models/post')
// const multer = require('multer')

// const MIME_TYPE_MAP = {
//   'image/png': 'png',
//   'image/jpeg': 'jpg',
//   'image/jpg': 'jpg'
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     if (isValid) {
//       error = null;
//     }
//     cb(error, "backend/images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(' ').join('-');
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + '-' + Date.now() + '.' + ext);
//   }
// });


router.post('', (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  // console.log(post)
  post.save().then(result => {
    res.status(201).json({
      message: "Post Added Successfully",
      postId: result._id
    })

  });
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    }
    else {
      res.status(404).json({
        message: "Post Not Found!"
      })
    }
  })
})

router.get('', (req, res, next) => {
  //  const posts = [
  //   {
  //     id:"alsildjiosa",
  //     title:"First Post",
  //     content:"Something Special"
  //   },
  //   {
  //     id:"asiudq8932",
  //     title:"Second Post",
  //     content:"Something Special!"
  //   }
  //  ]
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if(pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(documents => {
    res.status(200).json({
      message: "Posts Fetched Successfully",
      posts: documents
    })
  })
})


router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Updated Successfully"
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post Deleted"
    });
  });
})

// app.use((req,res,next)=>{
//   res.send("Hello from express");
// })


module.exports = router
