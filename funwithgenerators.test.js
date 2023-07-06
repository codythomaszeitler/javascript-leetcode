function request(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, 1000);
  });
}

describe("generator functions", () => {
  it("should be able to put a value into undefined yield", () => {

    function* main() {
      var result1 = yield request("http://some.url.1");
      var data = JSON.parse(result1);

      var result2 = yield request("http://some.url.2?id=" + data.id);
      var resp = JSON.parse(result2);
      console.log("The value you asked for: " + resp.value);
    }

    var it = main();
    it.next();
  });
});
