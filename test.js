const { Builder, By, until } = require("selenium-webdriver");
const { describe, it, after, before } = require("mocha");
const assert = require("assert");

let driver;

describe("Tic-Tac-Toe Game Tests", function () {
  this.timeout(30000);

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    let url = "http://127.0.0.1:5500/selection_code/index.html";
    await driver.get(url); 
  });

  after(async () => {
    await driver.quit();
  });

  it("should have 9 cells", async () => {
    const cells = await driver.findElements(By.className("cell"));
    assert.strictEqual(cells.length, 9);
  });

  it("should start with Player X's turn", async () => {
    const status = await driver.findElement(By.id("status")).getText();
    assert.strictEqual(status, "Player X's turn");
  });

  it("should place X in the first cell when clicked", async () => {
    const firstCell = await driver.findElement(By.id("0"));
    await firstCell.click();
    const text = await firstCell.getText();
    assert.strictEqual(text, "X");
  });

  it("should switch to Player O after Player X moves", async () => {
    const status = await driver.findElement(By.id("status")).getText();
    assert.strictEqual(status, "Player O's turn");
  });

  it("should place O in the second cell when clicked", async () => {
    const secondCell = await driver.findElement(By.id("1"));
    await secondCell.click();
    const text = await secondCell.getText();
    assert.strictEqual(text, "O");
  });

  it("should declare Player X as the winner for the top row", async () => {
    await driver.findElement(By.id("2")).click(); 
    await driver.findElement(By.id("4")).click(); 
    await driver.findElement(By.id("3")).click(); 
    await driver.findElement(By.id("5")).click(); 
    await driver.findElement(By.id("6")).click(); 

    const status = await driver.findElement(By.id("status")).getText();
    assert.strictEqual(status, "Player X wins!");
  });

  it("should reset the game board", async () => {
    await driver.findElement(By.tagName("button")).click(); 
    const cells = await driver.findElements(By.className("cell"));
    for (const cell of cells) {
      const text = await cell.getText();
      assert.strictEqual(text, "");
    }
    const status = await driver.findElement(By.id("status")).getText();
    assert.strictEqual(status, "Player X's turn");
  });

  it("should declare a draw if all cells are filled with no winner", async () => {
    await driver.findElement(By.tagName("button")).click(); 

    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8]; 
    let turn = "X";
    for (const move of moves) {
      await driver.findElement(By.id(move.toString())).click();
      turn = turn === "X" ? "O" : "X";
    }

    const status = await driver.findElement(By.id("status")).getText();
    assert.strictEqual(status, "It's a draw!");
  });

  it("should not allow a player to click on a filled cell", async () => {
    await driver.findElement(By.tagName("button")).click(); 
    await driver.findElement(By.id("0")).click(); 
    await driver.findElement(By.id("0")).click(); 

    const firstCell = await driver.findElement(By.id("0")).getText();
    assert.strictEqual(firstCell, "X"); 
  });

  it("should allow clicking on the second column", async () => {
    await driver.findElement(By.id("1")).click(); 
    const secondCell = await driver.findElement(By.id("1")).getText();
    assert.strictEqual(secondCell, "O");
  });

});
