var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
const url = "https://www.jumia.com.eg/mobiles-tablets";
const serverURL = "http://localhost:3000"


request(url, function(error, response, html) {


    if (!error) {

        var $ = cheerio.load(html);

        // Finally, we'll define the variables we're going to capture
        $(".products").filter(function() {
            var data = $(this);

            data.find(".sku").each(function(index) {
                var productLink = $(this).find('a').attr('href')
                request(productLink, function(error, response, html) {
                    var json = {
                        name: "",
                        desc: "",
                        price: "40",
                        created:Date.now(),
                        user:'ObjectId("5911e0574b3074f1bcf19cfd")'
                    };

                    var $ = cheerio.load(html)
                    var data = $(this)
                    $(".details").filter(function() {
                        json.name = $(this).find('h1').text();
                        $(this).find('ul').each(function() {
                            json.desc += $(this).find('li').text()
                        });
                    })
                    request.post(
                        serverURL+'/api/products',
                            json
                        ,
                        function(error, response, body) {
                          console.log(json);
                            if (!error && response.statusCode == 200) {
                                console.log(body)
                            }
                            else{
                              console.log(response);
                            }
                        }
                    );

                })
            })

        })
    }
})
