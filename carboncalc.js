import { WebsiteCarbonCalculator, WebsiteCarbonCalculatorError } from 'website-carbon-calculator';

const adviceAPIkey = 'AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk'
const inputForm = document.getElementById("siteinput");

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    calcMyCarbon();
})

function calcMyCarbon() {

    try {

        const websiteCarbonCalculator = new WebsiteCarbonCalculator({ pagespeedApiKey: adviceAPIkey });
        const result = websiteCarbonCalculator.calculateByURL('https://blockstarter.info');

        //   {
        //     url: 'yourwebsite.com',
        //     bytesTransferred: 123456,
        //     isGreenHost: true,
        //     co2PerPageview: 0.1234567,
        //   }

        console.log(result)
    } catch (error) {
        if (error instanceof WebsiteCarbonCalculatorError) {
            console.warn(error.message);
        }
    }
}