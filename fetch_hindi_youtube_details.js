const fs = require('fs');

const links = [
  "https://youtu.be/U63zW7fUhJw?si=iW60CrRmOpWf7bv0",
  "https://youtu.be/hMBdmu9fQvc?si=AgEMUWOrYO1U1DQA",
  "https://youtu.be/dx4Teh-nv3A?si=wqkJbX-UUEYjzVZC",
  "https://youtu.be/orYf6VDtj_k?si=GsCh-tfO4xYVTAqf",
  "https://youtu.be/00DvaPstcpo?si=_ncqdmlW0TfO3N4P",
  "https://youtu.be/K7o9fUEP3GU?si=MAorY7A9KSghr_m9",
  "https://youtu.be/AB-I3vsUk6g?si=JYr0cVttzqlstYse",
  "https://youtu.be/sUf2PtEZris?si=otKFqW1WP3rfb-t_",
  "https://youtu.be/pN--zyXztLI?si=698jwag1rPb0xh2B",
  "https://youtu.be/GVizJ_jpUnw?si=sw0JmJrtYGtounsr",
  "https://youtu.be/eTl-FnVvGu0?si=oayINvUphZOtS9QN",
  "https://www.youtube.com/live/IVjl5u4s-mQ?si=2JKtIHB5cKFcE-im",
  "https://youtu.be/n2dVFdqMYGA?si=ndoAMydnIF6bpE2A",
  "https://youtu.be/FudfVyYWNxQ?si=RbtZTTsn1KetImbe",
  "https://youtu.be/Ov0YGGSY6gY?si=kH7-SYx_wRg-b3e-",
  "https://youtu.be/2lPDqElikDs?si=NIvsTKsLdID2IK_o",
  "https://youtu.be/uNboFgKLGDY?si=Obt0f9MpGjF7NfQd",
  "https://youtu.be/y0qJKs_rtcE?si=PCn-isS9LCzPG4sS",
  "https://youtu.be/tLqtnGLfm4Q?si=7T-aN1X_X-_EeLYk",
  "https://youtu.be/9QvzrledPxg?si=cvk7jQF0ySoKokFF",
  "https://youtu.be/KUpwupYj_tY?si=RlKHbmLC3RW0CnTm",
  "https://youtu.be/5XZShg6_tpo?si=XJ230TXR8qCVf9nA",
  "https://youtu.be/HexFqifusOk?si=SyjO8fe_CGI_3VB3",
  "https://youtu.be/WWXm39leYew?si=cU9j5g9veA4YcYk5",
  "https://youtu.be/AgX2II9si7w?si=jn_MMt-ysWgwywUE",
  "https://youtu.be/VOLKJJvfAbg?si=LjdBD1Wt6_ZDCdvv",
  "https://youtu.be/Qdz5n1Xe5Qo?si=mlGV2q7hcUi7sNNA",
  "https://youtu.be/Njq4A5DAqRw?si=065YZy9HamEmqxH3",
  "https://youtu.be/BddP6PYo2gs?si=TXxVimUgRWJ5ZM-z",
  "https://youtu.be/hoNb6HuNmU0?si=tdIEsaa4TaSN2AX_",
  "https://youtu.be/UcOx6Bm3_4k?si=6VcPyd4wKq-FkpFY",
  "https://youtu.be/iAIBF2ngbWY?si=EyJyufGPNjYlAKsx",
  "https://youtu.be/HrnrqYxYrbk?si=H3VHrUnqAMEMhJGe",
  "https://youtu.be/6DfaBq2rVoE?si=gGTKNKCUzOhlVz4w",
  "https://youtu.be/zqGW6x_5N0k?si=uoMsLBqhxwLywxJW",
  "https://youtu.be/I0b88L53Gbg?si=_u9PNguS5tRP3qjS",
  "https://youtu.be/BBAyRBTfsOU?si=AWf01C6kipPoAkxj",
  "https://youtu.be/05TA9jNnCdU?si=-qcs0kl8OTLCwYtJ",
  "https://youtu.be/lbCRtrrMvSw?si=ZyF4MyMPvMalCBb7",
  "https://youtu.be/xC1cj9zhh6k?si=CVo_BvEtRgsU9_JW",
  "https://youtu.be/DS-raAyMxl4?si=RlZOWN3xohmnLIxU",
  "https://youtu.be/4HRC6c5-2lQ?si=DsR5quFRuhQEai9i",
  "https://youtu.be/DGVJtAHzzDQ?si=Zycsnw0AHG9QBmGT",
  "https://youtu.be/jIqRbFQl-ds?si=vxYtEDx7dWQT4kMe",
  "https://youtu.be/CeddFGq6sJ4?si=VNvN0aAAbLCBVZv7",
  "https://youtu.be/N2-HsIYd0Go?si=R1insu3Ee1aFHX1m",
  "https://youtu.be/is3Ia7dF9_U?si=qMQqKeXSxYMkLyvQ",
  "https://youtu.be/cl0a3i2wFcc?si=UuTIidbHpZO2aAxe",
  "https://youtu.be/zaCbuB3w0kg?si=t_lr6S_dqU_3Lh0y",
  "https://youtu.be/T5rmd-vKQeM?si=zWsxajcYPnur0arr",
  "https://youtu.be/8of5w7RgcTc?si=exzCXJHVwrnTn4qi",
  "https://youtu.be/XO8wew38VM8?si=9godikaSxo_R0Krs",
  "https://youtu.be/IdXyALMFA48?si=R4hilAxpClESwuYK",
  "https://youtu.be/pTY6TyUoqjM?si=H5xFpXUy_C19L3q0",
  "https://youtu.be/7_TT7jtCJOU?si=LvQLKkQsc6BqRGEt",
  "https://youtu.be/5Eqb_-j3FDA?si=Sk-hmI9ffbLaCzvO",
  "https://youtu.be/1gukvtH_a3I?si=q39m3egDyJUiCs9o"
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
            id: `h_new_${i++}`,
            title: data.title || 'Unknown Title',
            artist: data.author_name || 'Unknown Artist',
            ytId: ytId,
            lyrics: ''
          });
        } else {
          result.push({ id: `h_new_${i++}`, title: 'Unknown Title', artist: 'Unknown Artist', ytId, lyrics: '' });
        }
      } catch (e) {
        result.push({ id: `h_new_${i++}`, title: 'Unknown Title', artist: 'Unknown Artist', ytId, lyrics: '' });
      }
    }
  }

  // Create TS array string
  let output = `export const Hindi = [\n`;
  for (const item of result) {
    output += `    { id: '${item.id}', title: ${JSON.stringify(item.title)}, artist: ${JSON.stringify(item.artist)}, ytId: '${item.ytId}', lyrics: "" },\n`;
  }
  output += `];`;

  fs.writeFileSync('hindi_playlist.ts', output);
  console.log("Done");
}

main();
