const main = async () =>{
  const gnosisSafe = "0x9A878BE768a8Ac461315ec7F3aF9168dcDe922a8";
  console.log("Transferring the ownership of ProxyAdmin");

  await upgrades.admin.transferProxyAdminOwnership(gnosisSafe);
  console.log("Transferred ownership of ProxyAdmin to:", gnosisSafe);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
