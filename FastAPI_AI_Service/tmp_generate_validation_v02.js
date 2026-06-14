const fs = require('fs');
const outPath = 'app/data/Validation/Validation_Request_V02.json';

const candles = [
  '3_Day_WKND.md','Amber_And_Vanilla.md','BLOW_A_WISH.md','Coconut_And_Sea_Salt.md','Day_Party.md','Jasmin_ylang_ylang_sandalwood.md','Lavander_Vanilia.md','Milk_Vanilla.md','Nen_and_Hoa.md','Sandalwood_And_Rose.md','Shower_Playlist.md','smells_like_cacao_and_vanilla.md','Sunset_Disco.md','Warn_Cider_And_Cinamon.md','YOU_ARE_THE_MAGIC.md'
];
const diffusers = [
  'Lumos_And_Cucumber.md','Lumos_Honeydrew_And_Coconut.md','Lumos_Juicy_Peach.md','Lumos_Midnight_sandalwood.md','Lumos_Rose_Boutique.md','Lumos_Tropical_Orchard.md'
];
const oils = ['Lumos_Cajeput.md','Lumos_cold.md','Lumos_Lemongrass.md','Lumos_menthol.md'];
const accessories = ['Candle_holder.md','Candle_matchbox.md','Candle_metal_tray.md','Candle_pinwheel.md','Candle_rotation_tray.md','Candle_Scissor.md','Candle_Snuffer.md','Candle_Tray.md','Wood_tray.md'];
const gift = ['Dalat_Gift.md'];
const all = [...candles, ...diffusers, ...oils, ...accessories, ...gift];

const qas = [];
const add = (question, answer, docs) => qas.push({question, ground_truth_answer: answer, relevant_docs: docs});

// 1) Category overview (30)
const cats = [
  {name:'nến thơm', count:15, docs:candles, ex:['3_Day_WKND.md','Lavander_Vanilia.md','Nen_and_Hoa.md']},
  {name:'reed diffuser', count:6, docs:diffusers, ex:['Lumos_And_Cucumber.md','Lumos_Rose_Boutique.md','Lumos_Midnight_sandalwood.md']},
  {name:'tinh dầu', count:4, docs:oils, ex:['Lumos_Cajeput.md','Lumos_Lemongrass.md','Lumos_cold.md']},
  {name:'phụ kiện nến', count:9, docs:accessories, ex:['Candle_Scissor.md','Candle_Snuffer.md','Candle_Tray.md']},
  {name:'set quà', count:1, docs:gift, ex:['Dalat_Gift.md']}
];
for (const c of cats) {
  add(`Danh mục hiện có bao nhiêu sản phẩm thuộc nhóm ${c.name}?`, `Theo markdown trong Product_Catalogs, nhóm ${c.name} có ${c.count} sản phẩm.`, c.docs.slice(0, Math.min(5, c.docs.length)));
  add(`Kể tên các sản phẩm tiêu biểu của nhóm ${c.name}.`, `Một số sản phẩm tiêu biểu của nhóm ${c.name}: ${c.ex.map(x=>x.replace('.md','')).join(', ')}.`, c.ex);
  add(`Nhóm ${c.name} phù hợp use case nào nhất trong catalog?`, `Nhóm ${c.name} phù hợp tùy ngữ cảnh: nến thơm cho trải nghiệm mùi theo thời điểm, reed diffuser cho tỏa hương liên tục, tinh dầu cho khuếch tán trị liệu, phụ kiện nến cho an toàn/chăm sóc, set quà cho mục đích tặng.`, c.docs.slice(0, Math.min(4, c.docs.length)));
  add(`Nếu ưu tiên vận hành không cần lửa thì nhóm ${c.name} có phù hợp không?`, `${c.name==='reed diffuser' || c.name==='tinh dầu' ? 'Phù hợp, vì không cần đốt nến.' : 'Tùy sản phẩm; nhóm này không phải luôn là giải pháp không lửa.'}`, c.docs.slice(0, Math.min(4, c.docs.length)));
  add(`Trong nhóm ${c.name}, markdown có ghi rõ thời lượng sử dụng/burn time cho mọi sản phẩm không?`, `Không phải mọi sản phẩm đều có burn time hoặc thời lượng chi tiết; mức độ đầy đủ dữ liệu khác nhau giữa các file markdown.`, c.docs.slice(0, Math.min(4, c.docs.length)));
  add(`Nhóm ${c.name} có thể kết hợp thế nào với nhóm khác để tạo trải nghiệm toàn diện?`, `Có thể kết hợp theo bộ: nến + phụ kiện (scissor/snuffer/tray) hoặc diffuser + tinh dầu theo mục tiêu mùi hương và an toàn sử dụng.`, [...c.ex.slice(0,2), 'Candle_Scissor.md', 'Candle_Snuffer.md']);
}

// 2) Seasonal & space questions (20)
const seasonPrompts = [
  ['mùa hè', ['3_Day_WKND.md','Coconut_And_Sea_Salt.md','Lumos_Tropical_Orchard.md','Lumos_Honeydrew_And_Coconut.md']],
  ['mùa thu', ['Lavander_Vanilia.md','Amber_And_Vanilla.md','Nen_and_Hoa.md','Lumos_Midnight_sandalwood.md']],
  ['mùa đông', ['Warn_Cider_And_Cinamon.md','YOU_ARE_THE_MAGIC.md','Sandalwood_And_Rose.md','BLOW_A_WISH.md']],
  ['quanh năm', ['Shower_Playlist.md','Lumos_And_Cucumber.md','Candle_Scissor.md','Candle_Snuffer.md']]
];
const spaces = ['phòng ngủ','phòng khách','phòng tắm','phòng làm việc','khu vực thiền'];
for (const [season, docs] of seasonPrompts) {
  for (const space of spaces) {
    add(`Gợi ý sản phẩm cho ${space} vào ${season} nên ưu tiên nhóm nào?`, `Ưu tiên theo markdown: chọn mùi phù hợp bối cảnh ${space} và ${season}; thường kết hợp nến thơm hoặc reed diffuser, thêm phụ kiện nếu dùng nến.`, docs);
  }
}

// 3) Use-case recommendation (20)
const intents = [
  ['thư giãn sau giờ làm', ['Lavander_Vanilia.md','Nen_and_Hoa.md','Lumos_Midnight_sandalwood.md']],
  ['tăng tỉnh táo buổi sáng', ['Lumos_Lemongrass.md','Lumos_menthol.md','3_Day_WKND.md']],
  ['không gian lãng mạn', ['Lumos_Rose_Boutique.md','Sandalwood_And_Rose.md','BLOW_A_WISH.md']],
  ['mùi sạch cho phòng tắm', ['Shower_Playlist.md','Lumos_And_Cucumber.md','Coconut_And_Sea_Salt.md']],
  ['tiệc tối tại nhà', ['Sunset_Disco.md','Lumos_Rose_Boutique.md','Candle_Tray.md']],
  ['góc đọc sách ấm áp', ['Amber_And_Vanilla.md','smells_like_cacao_and_vanilla.md','Candle_Snuffer.md']],
  ['khử mùi khu vực kín', ['Lumos_Lemongrass.md','Lumos_Cajeput.md','Lumos_cold.md']],
  ['trang trí bàn tiếp khách', ['Candle_metal_tray.md','Candle_pinwheel.md','Wood_tray.md']],
  ['quà tặng dịp lễ', ['Dalat_Gift.md','YOU_ARE_THE_MAGIC.md','BLOW_A_WISH.md']],
  ['set chăm nến đầy đủ', ['Candle_Scissor.md','Candle_Snuffer.md','Candle_Tray.md']]
];
for (const [intent, docs] of intents) {
  add(`Nếu mục tiêu là ${intent} thì nên bắt đầu từ sản phẩm nào trong catalog?`, `Có thể bắt đầu bằng các sản phẩm: ${docs.map(x=>x.replace('.md','')).join(', ')}; sau đó tinh chỉnh theo sở thích mùi và mùa.`, docs);
  add(`Để đạt mục tiêu ${intent}, nên kết hợp nhiều nhóm sản phẩm như thế nào?`, `Cách kết hợp thường hiệu quả: nến hoặc diffuser làm mùi chính; thêm tinh dầu hoặc phụ kiện để tăng độ linh hoạt và an toàn khi sử dụng.`, docs);
}

// 4) Data quality & governance (15)
const qualityQs = [
  ['catalog markdown có chứa giá bán đầy đủ cho mọi sản phẩm không', 'Không. Dữ liệu giá không được chuẩn hóa đầy đủ trong toàn bộ markdown nên cần nguồn giá riêng.'],
  ['catalog markdown có đầy đủ tồn kho hoặc trạng thái còn hàng không', 'Không thấy trường tồn kho chuẩn hóa xuyên suốt toàn bộ file markdown.'],
  ['burn time có xuất hiện đồng đều cho tất cả nến không', 'Không đồng đều; một số nến có burn time rõ, một số không ghi chi tiết.'],
  ['thông số dung tích của diffuser có nhất quán không', 'Nhiều diffuser ghi 100ml hoặc 100-150ml, nhưng không phải file nào cũng theo cùng một format.'],
  ['dữ liệu có lỗi chính tả tên mùi hoặc tên sản phẩm không', 'Có một số chỗ không đồng nhất cách viết tên hoặc chính tả giữa file.'],
  ['metadata thương hiệu có đầy đủ ở tất cả file không', 'Không phải file nào cũng ghi thương hiệu rõ ràng và nhất quán.'],
  ['định dạng trường mood/season có chuẩn schema chung chưa', 'Chưa hoàn toàn; nội dung hữu ích nhưng chưa chuẩn hóa schema thống nhất.'],
  ['có thể dùng markdown làm nguồn duy nhất cho QA sản phẩm không', 'Có thể cho QA nền tảng, nhưng nên bổ sung nguồn chuẩn cho giá, tồn kho, và chuẩn hóa tên.'],
  ['catalog có phân biệt rõ sản phẩm có lửa và không lửa không', 'Có thể suy luận được từ nhóm nến, diffuser, tinh dầu và phụ kiện, nhưng chưa có trường chuẩn tường minh trong mọi file.'],
  ['có thể suy ra đầy đủ thông tin an toàn sử dụng từ markdown không', 'Chỉ một phần; thông tin an toàn chi tiết chưa xuất hiện đồng đều cho tất cả sản phẩm.'],
  ['có dữ liệu nào trùng lặp mô tả giữa nhiều file không', 'Có khả năng có các đoạn mô tả template lặp giữa các sản phẩm cùng dòng.'],
  ['catalog có hỗ trợ truy vấn theo mùa tốt không', 'Có, vì nhiều file ghi rõ mùa phù hợp; tuy nhiên mức độ chi tiết không hoàn toàn đồng nhất.'],
  ['catalog có hỗ trợ truy vấn theo không gian sử dụng tốt không', 'Có, nhiều file nêu phòng/khu vực dùng phù hợp như phòng ngủ, phòng tắm, phòng khách.'],
  ['catalog có đủ dữ liệu để làm gợi ý combo sản phẩm không', 'Có thể làm ở mức tốt nhờ có nhóm nến, diffuser, tinh dầu, phụ kiện và set quà.'],
  ['cần cải tiến gì để QA chính xác hơn', 'Nên chuẩn hóa schema metadata giữa các markdown và bổ sung giá, tồn kho, mã SKU, hướng dẫn an toàn.']
];
for (const [q,a] of qualityQs) add(`Trong phạm vi toàn catalog, ${q}?`, a, ['3_Day_WKND.md','Lumos_And_Cucumber.md','Lumos_Lemongrass.md','Candle_Scissor.md','Dalat_Gift.md']);

// 5) Cross-product comparisons (15)
const comparisons = [
  ['nến thơm và reed diffuser', 'Nến phù hợp trải nghiệm theo phiên; reed diffuser phù hợp tỏa hương liên tục không lửa.'],
  ['reed diffuser và tinh dầu', 'Diffuser dạng que tiện dụng hằng ngày; tinh dầu linh hoạt cho máy khuếch tán/xông theo mục tiêu.'],
  ['phụ kiện scissor và snuffer', 'Scissor dùng cắt bấc để cháy ổn định; snuffer dùng tắt nến an toàn, giảm khói.'],
  ['khay kim loại và khay gỗ', 'Khay kim loại thiên về decor phản chiếu/sang trọng; khay gỗ thiên về mộc mạc tự nhiên.'],
  ['dòng mùi fruity và woody', 'Fruity thường tươi sáng trẻ trung; woody thường ấm sâu, phù hợp không gian thư giãn buổi tối.'],
  ['dòng mùi fresh và gourmand', 'Fresh tạo cảm giác sạch thoáng; gourmand tạo cảm giác ấm ngọt, dễ chịu khi trời lạnh.'],
  ['sản phẩm dùng cho phòng tắm và phòng khách', 'Phòng tắm ưu tiên fresh/clean; phòng khách linh hoạt theo mục đích tiếp khách hoặc thư giãn.'],
  ['mùi cho ban ngày và ban đêm', 'Ban ngày hợp mùi sáng/nhẹ; ban đêm hợp mùi ấm/sâu để thư giãn.'],
  ['sản phẩm trang trí và sản phẩm chức năng mùi', 'Trang trí nhấn thẩm mỹ không gian; chức năng mùi tập trung vào trải nghiệm khứu giác.'],
  ['set quà và mua lẻ', 'Set quà tiện tặng và đồng bộ; mua lẻ linh hoạt theo ngân sách và sở thích cá nhân.'],
  ['sản phẩm thiên về thư giãn và sản phẩm thiên về tỉnh táo', 'Thư giãn thường floral/woody/warm; tỉnh táo thường fresh/citrus/herbal.'],
  ['nến dung tích lớn và nhỏ', 'Dung tích lớn phù hợp dùng dài hạn; dung tích nhỏ linh hoạt thử mùi hoặc không gian nhỏ.'],
  ['sản phẩm có thông số rõ và sản phẩm thiếu thông số', 'Nên ưu tiên sản phẩm có thông số rõ để dễ tư vấn; sản phẩm thiếu thông số cần xác minh thêm.'],
  ['mùa hè và mùa đông trong catalog', 'Mùa hè thiên mùi trái cây/fresh; mùa đông thiên warm/spicy/woody.'],
  ['catalog định hướng trải nghiệm và catalog định hướng kỹ thuật', 'Nguồn markdown hiện thiên về trải nghiệm mùi và ngữ cảnh sử dụng hơn là thông số kỹ thuật đầy đủ.']
];
for (const [topic, ans] of comparisons) add(`So sánh ở mức toàn catalog giữa ${topic}.`, ans, ['3_Day_WKND.md','Sunset_Disco.md','Lumos_And_Cucumber.md','Lumos_Lemongrass.md','Candle_Scissor.md','Candle_Snuffer.md']);

if (qas.length !== 100) {
  throw new Error(`Generated ${qas.length} items, expected 100`);
}

fs.writeFileSync(outPath, JSON.stringify(qas, null, 2), 'utf8');
console.log(`Wrote ${qas.length} items to ${outPath}`);
