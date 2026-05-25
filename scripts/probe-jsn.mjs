process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const url = process.argv[2] || "https://janasenanewsletter.com/news";
const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
const t = await res.text();
console.log("status", res.status, "len", t.length);
const urls = [...t.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((m) => m[0]);
const interesting = [...new Set(urls)].filter(
  (u) => /api|content|news|press|gallery/i.test(u) && u.includes("janasena"),
);
console.log("urls:", interesting.slice(0, 40));
const scriptSrc = [...t.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
console.log("scripts:", scriptSrc.filter((s) => s.includes("js")).slice(0, 15));
