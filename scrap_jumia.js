var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
const url = "https://www.jumia.com.eg/mobiles-tablets";
request(url, function(error, response, html){


        if(!error){

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            $(".products").filter(function () {
              var data = $(this);

              data.
            })
            // var name, desc, price;
            // var json = { name : "", desc : "", price : ""};
        }
    })
