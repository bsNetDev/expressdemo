var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./models/Bear');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

mongoose.connect('mongodb://bsessions:mongodbpass@ds261828.mlab.com:61828/expressdemo')
.then(function() {
    console.log('logged in to mongodb!')
}).catch(function(err) {
    console.error(err);
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening');
    next();
});

router.get('/', function(req, res) {
    res.json({message: 'hooray! welcome to ourapi!'});
});

// more routes for our API will happen here
router.route('/bears')
    .post(function(req, res) {
        var bear = new Bear();
        bear.name = req.body.name;

        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({message: 'Bear created!'});
        });

    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });


router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            
                res.json(bear);
        });
    })
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);

            bear.name = req.body.name;

            bear.save(function(err) {
                if (err)
                    res.send(err);
                
                res.json({ message: 'Bear updated!'});
            });
        });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({message: 'successfully deleted'});
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port);

console.log('Magic happens on port' + port);