'use strict'
const express = require('express');
const os = require('os');
const fs = require('fs');

const app = express();
const path = require("path");
const countryWise = fs.readFileSync(path.resolve(__dirname,"country_hmr_percentile.json"));
const stateWise = fs.readFileSync(path.resolve(__dirname,"state_wise_median_hmr.json"));  
let country = JSON.parse(countryWise);
let state = JSON.parse(stateWise)  

app.get('/country/:year/:month', (req, res) => {
	var year = req.params.year
	var month = req.params.month
	var hmrData
	for (let i = 0; i < country["aggregations"]["year"]["buckets"].length; i++ ) {	
		if ( country["aggregations"]["year"]["buckets"][i]['key'] == year ) {
			for (let  j = 0; j < country["aggregations"]["year"]["buckets"][i]['months']['buckets'].length; j++ ){
					if (country["aggregations"]["year"]["buckets"][i]['months']['buckets'][j]['key'] == month) {
						hmrData = country["aggregations"]["year"]["buckets"][i]['months']['buckets'][j];
					}
				}
			}
		}
	var lowerBound = hmrData['hmrPercentiles']['values']['45.0']
	var upperBound = hmrData['hmrPercentiles']['values']['60.0']
	res.send({ '45' : lowerBound,
			   '60' : upperBound })
});


app.get('/state/:year/:month', (req, res) => {

	console.log("api reached here")
	var year = req.params.year
	var month = req.params.month
	var extractedData = []

	for (let i = 0; i < state["aggregations"]["year"]["buckets"].length; i++ ) {	
		if ( state["aggregations"]["year"]["buckets"][i]['key'] == year ) {
			for (let  j = 0; j < state["aggregations"]["year"]["buckets"][i]['month']['buckets'].length; j++ ){
					if (state["aggregations"]["year"]["buckets"][i]['month']['buckets'][j]['key'] == month) {
						var sd =state["aggregations"]["year"]["buckets"][i]['month']['buckets'][j]['splitBy']['buckets'];
						for (let k = 0; k < sd.length; k++) {
							var value = sd[k]['hmrPercentiles']['values']['50.0']
							var statename = sd[k]['key']
							var sdata = { val : value,name : statename }
							extractedData[k] = sdata
						}
					}
				}
			}
		}
	
	res.send({ months : extractedData })
});

app.get('/home', (req,res) => {
	res.sendFile(path.join(__dirname+'../../../dist/index.html'))
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
