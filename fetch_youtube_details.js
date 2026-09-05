const fs = require('fs');

const links = [
  "https://youtu.be/d-B29nCwtEE?si=h06qlwa9ydKvB5oD",
  "https://youtu.be/guv_YlxJIHo?si=raE8oILNmf5G6P0G",
  "https://youtu.be/r88ZgrQPTbQ?si=gT1En6NN9xkZXVEm",
  "https://youtu.be/qMPqnA8kjT0?si=zCdulWn4gUR3k-bE",
  "https://youtu.be/Ib_L3vuUX5k?si=mHXpsQa3Y_DVXPpR",
  "https://youtu.be/t99Z5ym-nJY?si=TH2Qp0njTOcKLbSJ",
  "https://youtu.be/7IKvK2x16aY?si=h9lfiJzVvL7uHen9",
  "https://youtu.be/XXNbzwbepWw?si=FO12LTC7rSFSAazT",
  "https://youtu.be/7UbpNPb255k?si=lWASTbeUI4fr8HBo",
  "https://youtu.be/1reZByeUhPY?si=VhAF35aEavE3IGGo",
  "https://youtu.be/4vPKLGz0bU4?si=mA7SuQPSAUyoueUR",
  "https://youtu.be/fILC1AqOM_k?si=Dh0IJVhr6cRG8DWH",
  "https://youtu.be/u2UHKKiqqOA?si=WPrrQY457yHFMd38",
  "https://youtu.be/9c1NIrAqXe4?si=M5wjX3niXgdejoze",
  "https://youtu.be/ep52mT-w_TI?si=86to3uee2n_YXnXr",
  "https://youtu.be/QZYDmwpVDGs?si=nwjYFUo-JH6npWGH",
  "https://youtu.be/o5iNbmDbViA?si=J_rO-ixvn4OaZ2Tw",
  "https://youtu.be/jqf8BDOYles?si=vhsLo5X-vMSaeAzx",
  "https://youtu.be/uhhdKNAWnfM?si=4n498OF_fXD8Zmyq",
  "https://youtu.be/gMbmvRj0j7E?si=Pml8pS6IjFCuzxFy",
  "https://youtu.be/enAHzgM3J2M?si=zbrf7R3nlOg96Lf6",
  "https://youtu.be/5f1O74GwWJM?si=TU8ANb9Yqfv5Sxjd",
  "https://youtu.be/IU340-JBKA4?si=m0VjHilfqa0Gncy8",
  "https://youtu.be/xlElO06nQy8?si=C7qtCKt2wSy8usXm",
  "https://youtu.be/sn4ok8KAoKQ?si=kI5ruJUlUl43ARPQ",
  "https://youtu.be/YA0fzrnKmCs?si=8eutzTpO-39cp0WS",
  "https://youtu.be/NWKDbecvheo?si=xuvhbFWVqsPB9YC8",
  "https://youtu.be/VwibjuKHO0c?si=dSpubu9NyRAlzCWT",
  "https://youtu.be/cLizhImPFyQ?si=O4IxCng5l0RVgLos",
  "https://youtu.be/C8_VfjZI-OY?si=yXthzyunH61rjhiq",
  "https://youtu.be/ReBHEyAd2zk?si=5_CoPvBqvj_hF5pK",
  "https://youtu.be/XOuc-oVSOnw?si=PGIzSnLNBy3a4RCB",
  "https://youtu.be/UpxTJXxTJJ0?si=Hye672vQxDemhGT7",
  "https://youtu.be/8ysq4DK-mpQ?si=Z9B8MQadqggClu71",
  "https://youtu.be/NsZa2_zNp7o?si=cfgib50Wwjaje6tT",
  "https://youtu.be/id5_3dKvEBg?si=Yte-ycG8Fn1KhBhy",
  "https://youtu.be/R7f_Kk8P8XY?si=CMo4vmIP3I8-ZQtU",
  "https://youtu.be/T71ZyjvCtOA?si=biMPtY40SV7dhBRc",
  "https://youtu.be/eKH-mHSL8Zo?si=tHNxMRIHpbftbYVE",
  "https://youtu.be/UhZbjnnzcG4?si=fwXdYRqOHAKIXbbo",
  "https://youtu.be/L2Z0Y-vTQNc?si=HZL-xzdTyp4kfa0l",
  "https://youtu.be/i7gj9xogbR0?si=J9oF8oAPiR2jI4Id",
  "https://youtu.be/J03Ts-HdzGI?si=AsCFKzmgjdo3Lj58",
  "https://www.youtube.com/live/ekmv-O0UulE?si=CHbyY9sBUI321cvT",
  "https://youtu.be/e90alqXR9dM?si=84YodBjS2wpAJpnM",
  "https://youtu.be/XpYWLmtvvII?si=6oecgYYbmraNmFqK"
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
            id: `b_new_${i++}`,
            title: data.title || 'Unknown Title',
            artist: data.author_name || 'Unknown Artist',
            ytId: ytId,
            lyrics: ''
          });
        } else {
          result.push({ id: `b_new_${i++}`, title: 'Unknown Title', artist: 'Unknown Artist', ytId, lyrics: '' });
        }
      } catch (e) {
        result.push({ id: `b_new_${i++}`, title: 'Unknown Title', artist: 'Unknown Artist', ytId, lyrics: '' });
      }
    }
  }

  // Create TS array string
  let output = `export const Bengali = [\n`;
  for (const item of result) {
    output += `    { id: '${item.id}', title: ${JSON.stringify(item.title)}, artist: ${JSON.stringify(item.artist)}, ytId: '${item.ytId}', lyrics: "" },\n`;
  }
  output += `];`;

  fs.writeFileSync('bengali_playlist.ts', output);
  console.log("Done");
}

main();
