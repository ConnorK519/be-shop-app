const { formatUsers } = require("../db/seeds/utils");
const { userData, productData } = require("../db/data/test-data/index");
const expect = require("chai").expect;

describe("formatUsers", () => {
  it("should return an empty array if passed an empty array", () => {
    const result = formatUsers([]);
    expect(result).to.deep.equal([]);
  });
  it("should not mutate the input", () => {
    const testUsers = [{ ...userData[0] }];
    formatUsers(testUsers);
    expect(testUsers[0]).to.deep.equal(userData[0]);
  });
  it("should return a nested array with all the correct values when passed a single object in an array", () => {
    const testUsers = [userData[0]];
    const result = formatUsers(testUsers);
    expect(Array.isArray(result[0])).to.equal(true);
    expect(result[0][0]).to.equal(userData[0].username);
    expect(result[0][1]).to.equal(userData[0].first_name);
    expect(result[0][2]).to.equal(userData[0].last_name);
    expect(result[0][3]).to.equal(userData[0].email);
    expect(result[0][4].length).to.equal(60);
    expect(result[0][5]).to.equal(userData[0].post_code);
    expect(result[0][6]).to.equal(userData[0].town_or_city);
    expect(result[0][7]).to.equal(userData[0].house_number);
    expect(result[0][8]).to.equal(userData[0].street);
    expect(result[0][9]).to.equal("{}");
    expect(result[0][10]).to.equal(userData[0].created_at);
  });
  it("should return an array with each object replaced by an array with the same number of values", () => {
    const result = formatUsers(userData);
    let check = true;
    expect(result.length).to.equal(userData.length);
    for (let i = 0; i < result.length; i++) {
      if (
        !Array.isArray(result[i]) ||
        result[i].length !== 11 ||
        result[i][4].length !== 60
      ) {
        check = false;
      }
    }
    expect(check).to.equal(true);
  });
});
