var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;


var driver_fx = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

var driver_chr = new webdriver.Builder()
    .forBrowser('chrome')
    .build();


searchTest(driver_fx);
searchTest(driver_chr);

function searchTest(driver) {
  driver.get('https://dbull7.github.io/2DoBox-pivot/');
  driver.findElement(By.id('title-input')).sendKeys('11111');
  driver.findElement(By.id('content-input')).sendKeys('22222');
  driver.findElement(By.id('submit')).click();

  driver.findElement(By.id('title-input')).sendKeys('33333');
  driver.findElement(By.id('content-input')).sendKeys('44444');
  driver.findElement(By.id('submit')).click();

  driver.findElement(By.id('title-input')).sendKeys('55555');
  driver.findElement(By.id('content-input')).sendKeys('66666');
  driver.findElement(By.id('submit')).click();

  // find search and sendKeys 1 to search
  driver.findElement(By.id('search')).sendKeys('5');

  driver.sleep(3000).then(function() {
    driver.findElement(By.className('entry-title')).getText().then(function(title){
      if (title == "55555") {
        console.log('title test passed')
      } else {
        console.log('title test failed')
      }
    })
  });
  driver.quit();

}
