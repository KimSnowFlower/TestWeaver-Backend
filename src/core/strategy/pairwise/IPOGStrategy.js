const PairwiseStrategy = require("./PairwiseStrategy");
const { generatePairwise } = require("./PairwiseEngine");

class IPOGStrategy extends PairwiseStrategy {
    generate(parameters) {
        return generatePairwise(parameters);
    }
}

module.exports = IPOGStrategy;