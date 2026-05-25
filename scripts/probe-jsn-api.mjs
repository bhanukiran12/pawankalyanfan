process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const id = "866ef9d1-6da5-4cd1-9b95-65332704650f";
const res = await fetch(
  `https://janasenanewportal.azurewebsites.net/content/GetContent?contentID=${id}`,
);
console.log("status", res.status);
const t = await res.text();
console.log(t.slice(0, 1500));
