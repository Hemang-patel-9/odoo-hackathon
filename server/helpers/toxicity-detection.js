const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.7;

const detectToxicity = async (text) => {
	const model = await toxicity.load(threshold);

	const predictions = await model.classify([text]);

	const toxicLabels = predictions
		.filter(p => p.results[0].match)
		.map(p => p.label);

	if (toxicLabels.length > 0) {
		console.log("Toxic lables", toxicLabels);
		return true;
	} else {
		return false;
	}
}

module.exports = { detectToxicity }