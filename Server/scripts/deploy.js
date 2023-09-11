const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("BookStore");
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log("contract deployed to:", contract.address);
};
//0xF85e456b29a1a94f36E2ac5De468047A43D9D49F
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
