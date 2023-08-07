const fs = require('fs');
var translate = require('translate-google-api')
var resources = require('./languages/resources')

const countyCodeList = ['de', 'it', 'ga', 'fr', 'nl']
const outFilePath = __dirname+`/output/result.json`

async function trans(list, to) {
	const result = await translate(list, {
		tld: 'us',
		to
	})
	return result
}

function wordsList() {
	let list = resources.GB.translation
	list = Object.keys(list)
	return list
}

function makeJsonForGB(keyList) {
	let result = {}
	keyList.forEach(key => {
		result = {
			...result,
			[key]: key
		}
	});
	return result;
}

function makeJson(keyList, valList) {
	let result = {}
	keyList.forEach((key, index) => {
		result = {
			...result,
			[key]: valList[index]
		}
	});
	return result;
}

function finalLangJson() {
	let result = {}
	keyList.forEach((key, index) => {
		result = {
			...result,
			[key]: valList[index]
		}
	});
	return result;
}

function saveToFile(content) {
	var json = JSON.stringify(content,null,2)
	fs.writeFile(outFilePath, json, function(err) {
    if (err) throw err;
    console.log('complete');
    })
}

/**
 * Modify country code name
 * @param {*} code countryCode
 */
function modifyCode(code) {
	let result = code
	if (code === 'ga') {
		result = 'ie'
	}
	result = result.toUpperCase()
	return result
}

async function main() {
	const list = wordsList()
	/**
	 * Add for default GB
	 */
	let finalResult = {
		'GB': {
			'translation': makeJsonForGB(list)
		}
	}
	
	/**
	 * Get the translationg for all countries 
	 */
	for (let index = 0; index < countyCodeList.length; index++) {
		const code = countyCodeList[index]
		const valList = await trans(list, code)
		const jsonContent = makeJson(list, valList)
		const newCode = modifyCode(code)
		console.log(`----------- code: ${code}, newCode: ${newCode}`)
		finalResult = {
			...finalResult,
			[newCode]: {
				'translation': jsonContent
			}
		}
	}
	saveToFile(finalResult)
	console.log('------Saved Successfully!-------')
	return
}

main()