import './scss/main.scss'
import './carboncalc.js'



document.querySelector('#app').innerHTML = `
  <h1>Hello Carbon Face</h1>
  <p>Please input your website URL here:</p>
  <form id="siteinput" class="siteinput">
  <label for="urlname">Website</label>
  <input type="text" id="urlname" name="urlname"><br><br>
  <input type="submit" value="Submit">
</form>
`