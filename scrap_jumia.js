var express = require('express');
var fs = require('fs');
var request = require('request').defaults({
    jar: true
});
var cheerio = require('cheerio');
var app = express();
var cookieJar = request.jar();

const rootUrl = "https://www.jumia.com.eg/mobiles-tablets";
const serverURL = "http://localhost:3000"
var userId;
request({
        url: serverURL + '/api/auth/signin',
        method: "POST",
        json: true,
        body: {
            username: 'badr',
            password: 'We r B@dr1t'
        }
    },
    function(error, response, body) {
        if (!error) {
            request(rootUrl, function(error, response, html) {


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
                                    price: "",
                                    created: Date.now(),
                                    user: userId,
                                    url:""
                                };

                                var $ = cheerio.load(html)
                                var data = $(this)
                                json.url = $("#productImage").attr('src')
                                $(".details").filter(function() {
                                    json.name = $(this).find('h1').text();
                                    $(this).find('ul').each(function() {
                                        json.desc += $(this).find('li').text()
                                    });
                                    json.price = $(this).find('.price:nth-child(1)').text()
                                    json.price = json.price.split(' ')[1].replace(",", "");
                                })
                                request({
                                        url: serverURL + '/api/products',
                                        method: "POST",
                                        json: true,
                                        body: json
                                    },
                                    function(error, response, body) {
                                        console.log(json);
                                        if (!error && response.statusCode == 200) {
                                            console.log(body)
                                        } else {
                                            console.log(response);
                                        }
                                    })

                            })
                        })

                    })
                }
            })
        }
    }
)
