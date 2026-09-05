const fs = require('fs');

const links = [
  "https://youtu.be/JgDNFQ2RaLQ?si=3hJvN-rH9aDZ8zKA",
  "https://youtu.be/JrNMyzsYr4M?si=1KXdvSfD7Ouz4y1Q",
  "https://youtu.be/pRpeEdMmmQ0?si=AbnVpAY4KhIQFYAp",
  "https://youtu.be/euCqAq6BRa4?si=jRvU18FTzX7U0BmI",
  "https://youtu.be/W0DM5lcj6mw?si=6fj84MSHnDw2b7zR",
  "https://youtu.be/liTfD88dbCo?si=tVc13HR-z7_hPIp7",
  "https://youtu.be/salwJjShv2M?si=0GjasCX4SIlh5Yza",
  "https://youtu.be/kffacxfA7G4?si=fdnLejTC8P7EcklB",
  "https://youtu.be/HfoNNEA9MIE?si=A2Mgo_A_f5t9mA8S",
  "https://youtu.be/jLNrvmXboj8?si=G00CgDWkpPBOQQ5N",
  "https://youtu.be/4lMKsUZZu3Y?si=eWPiMgTxltOKgfYD",
  "https://youtu.be/l2rbnKyHgho?si=g2fRlvSkDzjF45qs",
  "https://youtu.be/a9VHDa9mOvY?si=r_0sq5N3jgPPk7eI",
  "https://youtu.be/JKRRl5-5-hw?si=lN_C6zoLkFCyBhrL",
  "https://youtu.be/S1wiLj-JUCc?si=z7uWWSE0qg5_RLTs",
  "https://youtu.be/kRZs91of3c4?si=KzguNbL-5du7UYBf",
  "https://youtu.be/WJBPc3IQD5g?si=4nAvYN88Z7EU5rYX",
  "https://youtu.be/nesM9AGNoXk?si=JcWPxs-uOlfxuw1w",
  "https://youtu.be/ww6N-jyjsbw?si=xGFBUALrDygpJwtH",
  "https://youtu.be/k0Ka-deab1s?si=Iy5ue-nex30yQJtp"
];

async function main() {
  const result = [];
  let i = 1;
  for (const url of links) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([^"&?\/\s]{11})/);
    const ytId = match ? match[1] : null;
    if (ytId) {
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`);
        if (res.ok) {
          const data = await res.json();
          result.push({
            id: `e_new_${i++}`,
            title: data.title || 'Unknown Title',
            artist: data.author_name || 'Unknown Artist',
            ytId: ytId,
            lyrics: ''
          });
        } else {
          result.push({ id: `e_new_${i++}`, title: 'Unknown Title', artist: 'Unknown Artist', ytId, lyrics: '' });
        }
      } catch (e) {
        result.push({ id: `e_new_${i++}`, title: 'Unknown Title', artist: 'Unknown Artist', ytId, lyrics: '' });
      }
    }
  }

  // Create TS array string
  let output = `export const English = [\n`;
  for (const item of result) {
    output += `    { id: '${item.id}', title: ${JSON.stringify(item.title)}, artist: ${JSON.stringify(item.artist)}, ytId: '${item.ytId}', lyrics: "" },\n`;
  }
  output += `];`;

  fs.writeFileSync('english_playlist.ts', output);
  console.log("Done");
}

main();
