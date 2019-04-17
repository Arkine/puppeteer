/*
User Journey: Ensure Invalid Email Address on Card Application Fails with Correct Error Messages

Navigate to http://open.com/, follow any redirects
If a modal is displayed (e.g. "Get more information to help you choose a program..."), bypass this by choose "X" or "I'm not interested."
Choose "View All Cards" under "Secure funding for your business" and the "Business Cards" sub column
Notice a list of business cards are shown
Choose "Apply" for the first card shown
Notice the card application form is shown
Input an invalid email address (e.g. "invalidemail") under the "Email Address" field
Expect/Assert an inline error is shown relative to the field which reads "Your Email Address is missing the @ symbol")
Choose "Continue" at the end of the form without filling in any other fields
Expect/Assert the form to fail submission and present the error text at the top of the form which reads "Please make sure that all required fields are complete and valid"
*/

module.exports = async (ctx) => {
    return ctx;
}