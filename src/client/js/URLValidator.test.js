const URLValidator = require("./URLValidator")
// @ponicode
describe("URLValidator.isDateValid", () => {
    test("0", () => {
        let callFunction = () => {
            URLValidator.isDateValid({ key: "Elio" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            URLValidator.isDateValid({ key: "Dillenberg" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            URLValidator.isDateValid({ key: "elio@example.com" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            URLValidator.isDateValid(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
