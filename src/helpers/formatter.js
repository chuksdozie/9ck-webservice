const Formatter = {
    /**
     * @function formatToIntNumber
     * @description format a number to international format if not saved that way
     * works for only Nigerian & US numbers for now
     * @param {String} number - number to format
     * @returns {String} formattedNumber - number formatted to international format
     */

    formatToIntNumber: function (num) {
        const number = Formatter.stripSpaces(num)
        //nigerian number
        if (
            number.startsWith('07') ||
            number.startsWith('08') ||
            number.startsWith('09')
        ) {
            //change to international format
            const formattedNumber = '+234' + number.substring(1)
            return formattedNumber
        }
        //US number
        else if (number.startsWith('(')) {
            const regionCode = number.substring(1, 4)
            //parse the second part of the number
            const secondPart = number.substring(5).trim()
            const noExtraChars = secondPart.split('-').join('')

            const formattedNumber = '+1' + regionCode + noExtraChars
            return formattedNumber
        }
        //for numbers outside the US, the number is probably saved in intl format already
        //eg a UK number saved in intl on an american user's phone
        else {
            return number
        }
    },

    /**
     * @function stripSpaces
     * @description remove spaces from a string, useful for phone number matching
     * @param {String} str - string to strip
     * @returns {String} strippedStr - space stripped version of the string
     */

    stripSpaces: function (str) {
        return str.trim().split(' ').join('')
    },
}

module.exports = Formatter
