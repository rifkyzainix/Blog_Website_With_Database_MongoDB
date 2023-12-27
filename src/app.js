//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const path = require('path');

const homeStartingContent = " ";
const aboutContent = "Selamat datang di Blog Website Kami adalah mitra yang setia untuk mewujudkan impian Anda memiliki blog pribadi atau bisnis secara online Dengan fokus pada kemudahan, kreativitas, dan keandalan, Nama Layanan Pembuatan Blog hadir untuk membantu Anda menggambarkan dan mewujudkan visi unik Anda di dunia digital.";
const contactContent = "Kami senang sekali mendengar dari Anda. Jika Anda memiliki pertanyaan, masukan, atau ingin berbagi pengalaman, kami siap melayani Anda. Tim kami yang ramah dan berkomitmen tersedia untuk membantu menjawab pertanyaan Anda dan memberikan dukungan yang diperlukan.Berikut adalah beberapa cara untuk menghubungi kami:";

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://zainifaroj:PgZCpjD4Ptub0DhS@cluster0.evsak56.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('strictQuery', true);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// Tampilkan semua post di halaman utama
app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

// Tampilkan form untuk membuat post baru
app.get("/compose", function(req, res){
  res.render("compose");
});

// Terima data dari form dan simpan post baru ke database
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

// Tampilkan halaman detail post
app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      postId: requestedPostId,
      title: post.title,
      content: post.content
    });
  });
});

// Hapus post
app.post("/delete/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findByIdAndRemove(requestedPostId, function(err) {
    if (!err) {
      console.log("Post berhasil dihapus");
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});

// Tampilkan form edit post
app.get("/edit/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("edit", {
      title: post.title,
      content: post.content,
      postId: post._id
    });
  });
});

// Simpan perubahan setelah edit post
app.post("/edit/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findByIdAndUpdate(requestedPostId, {title: req.body.postTitle, content: req.body.postBody}, function(err) {
    if (!err) {
      res.redirect("/posts/" + requestedPostId);
    } else {
      console.log(err);
    }
  });
});

app.get("/article", function(req, res){
  Post.find({}, function(err, posts){
    res.render("article", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

const contactSchema = {
  name: String,
  email: String,
  subject: String,
  message: String,
  phone: String,
  company: String,
  website: String
};

const Contact = mongoose.model("Contact", contactSchema);

// Menyimpan data kontak baru ke database
app.post("/contact", function (req, res) {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    phone: req.body.phone,
    company: req.body.company,
    website: req.body.website
  });

  contact.save(function (err) {
    if (!err) {
      res.send("Data kontak berhasil disimpan.");
    } else {
      res.status(500).send("Terjadi kesalahan saat menyimpan data kontak.");
    }
  });
});

// Menampilkan semua data kontak dari database
app.get("/contact", function (req, res) {
  Contact.find({}, function (err, contacts) {
    if (!err) {
      res.json(contacts);
    } else {
      res.status(500).send("Terjadi kesalahan saat mengambil data kontak.");
    }
  });
});

// Menampilkan halaman formulir kontak
app.get("/contact", function (req, res) {
  res.render("contact-form");
});

app.listen(3001, function () {
  console.log("Server started on port 3000");
});