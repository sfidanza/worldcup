db = db.getSiblingDB('worldcup2002');
db.getCollection('stadiums')
    .insertMany([
        { id: '1', name: 'International Stadium Yokohama', city: 'Yokohama' },
        { id: '2', name: 'Seoul World Cup Stadium', city: 'Seoul' },
        { id: '3', name: 'Daegu World Cup Stadium', city: 'Daegu' },
        { id: '4', name: 'Saitama Stadium 2002', city: 'Urawa' },
        { id: '5', name: 'Busan Asiad Stadium', city: 'Busan' },
        { id: '6', name: 'Sapporo Dome', city: 'Sapporo' },
        { id: '7', name: 'Incheon Munhak Stadium', city: 'Incheon' },
        { id: '8', name: 'Shizuoka Ecopa Stadium', city: 'Fukuroi' },
        { id: '9', name: 'Nagai Stadium', city: 'Osaka' },
        { id: '10', name: 'Miyagi Stadium', city: 'Rifu' },
        { id: '11', name: 'Gwangju World Cup Stadium', city: 'Gwangju' },
        { id: '12', name: 'Munsu Football Stadium', city: 'Ulsan' },
        { id: '13', name: 'Suwon World Cup Stadium', city: 'Suwon' },
        { id: '14', name: 'Ōita Stadium', city: 'Oita' },
        { id: '15', name: 'Jeonju World Cup Stadium', city: 'Jeonju' },
        { id: '16', name: 'Niigata Stadium', city: 'Niigata' },
        { id: '17', name: 'Jeju World Cup Stadium', city: 'Seogwipo' },
        { id: '18', name: 'Kashima Soccer Stadium', city: 'Kashima' },
        { id: '19', name: 'Kobe Wing Stadium', city: 'Kobe' },
        { id: '20', name: 'Daejeon World Cup Stadium', city: 'Daejeon' }
    ]);
