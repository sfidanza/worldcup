db = db.getSiblingDB('worldcup2010');
db.getCollection('matches')
    .insertMany([
        {"id":1,"day":"Friday 11 June 2010","hour":"16:00","stadium":"1","group":"A","team1_id":"RSA","team2_id":"MEX","team1_score":1,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":2,"day":"Friday 11 June 2010","hour":"20:30","stadium":"6","group":"A","team1_id":"URU","team2_id":"FRA","team1_score":0,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":3,"day":"Saturday 12 June 2010","hour":"16:00","stadium":"2","group":"B","team1_id":"ARG","team2_id":"NGA","team1_score":1,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":4,"day":"Saturday 12 June 2010","hour":"13:30","stadium":"9","group":"B","team1_id":"KOR","team2_id":"GRE","team1_score":2,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":5,"day":"Saturday 12 June 2010","hour":"20:30","stadium":"4","group":"C","team1_id":"ENG","team2_id":"USA","team1_score":1,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":6,"day":"Sunday 13 June 2010","hour":"13:30","stadium":"8","group":"C","team1_id":"ALG","team2_id":"SVN","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":7,"day":"Sunday 13 June 2010","hour":"20:30","stadium":"7","group":"D","team1_id":"GER","team2_id":"AUS","team1_score":4,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":8,"day":"Sunday 13 June 2010","hour":"16:00","stadium":"10","group":"D","team1_id":"SRB","team2_id":"GHA","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":9,"day":"Monday 14 June 2010","hour":"13:30","stadium":"1","group":"E","team1_id":"NED","team2_id":"DEN","team1_score":2,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":10,"day":"Monday 14 June 2010","hour":"16:00","stadium":"5","group":"E","team1_id":"JPN","team2_id":"CMR","team1_score":1,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":11,"day":"Monday 14 June 2010","hour":"20:30","stadium":"6","group":"F","team1_id":"ITA","team2_id":"PAR","team1_score":1,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":12,"day":"Tuesday 15 June 2010","hour":"13:30","stadium":"4","group":"F","team1_id":"NZL","team2_id":"SVK","team1_score":1,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":13,"day":"Tuesday 15 June 2010","hour":"16:00","stadium":"9","group":"G","team1_id":"CIV","team2_id":"POR","team1_score":0,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":14,"day":"Tuesday 15 June 2010","hour":"20:30","stadium":"2","group":"G","team1_id":"BRA","team2_id":"PRK","team1_score":2,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":15,"day":"Wednesday 16 June 2010","hour":"13:30","stadium":"3","group":"H","team1_id":"HON","team2_id":"CHI","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":16,"day":"Wednesday 16 June 2010","hour":"16:00","stadium":"7","group":"H","team1_id":"ESP","team2_id":"SUI","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":17,"day":"Wednesday 16 June 2010","hour":"20:30","stadium":"10","group":"A","team1_id":"RSA","team2_id":"URU","team1_score":0,"team2_score":3,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":18,"day":"Thursday 17 June 2010","hour":"20:30","stadium":"8","group":"A","team1_id":"FRA","team2_id":"MEX","team1_score":0,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":19,"day":"Thursday 17 June 2010","hour":"16:00","stadium":"5","group":"B","team1_id":"GRE","team2_id":"NGA","team1_score":2,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":20,"day":"Thursday 17 June 2010","hour":"13:30","stadium":"1","group":"B","team1_id":"ARG","team2_id":"KOR","team1_score":4,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":21,"day":"Friday 18 June 2010","hour":"13:30","stadium":"9","group":"D","team1_id":"GER","team2_id":"SRB","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":22,"day":"Friday 18 June 2010","hour":"16:00","stadium":"2","group":"C","team1_id":"SVN","team2_id":"USA","team1_score":2,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":23,"day":"Friday 18 June 2010","hour":"20:30","stadium":"6","group":"C","team1_id":"ENG","team2_id":"ALG","team1_score":0,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":24,"day":"Saturday 19 June 2010","hour":"16:00","stadium":"4","group":"D","team1_id":"GHA","team2_id":"AUS","team1_score":1,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":25,"day":"Saturday 19 June 2010","hour":"13:30","stadium":"7","group":"E","team1_id":"NED","team2_id":"JPN","team1_score":1,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":26,"day":"Saturday 19 June 2010","hour":"20:30","stadium":"10","group":"E","team1_id":"CMR","team2_id":"DEN","team1_score":1,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":27,"day":"Sunday 20 June 2010","hour":"13:30","stadium":"5","group":"F","team1_id":"SVK","team2_id":"PAR","team1_score":0,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":28,"day":"Sunday 20 June 2010","hour":"16:00","stadium":"3","group":"F","team1_id":"ITA","team2_id":"NZL","team1_score":1,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":29,"day":"Sunday 20 June 2010","hour":"20:30","stadium":"1","group":"G","team1_id":"BRA","team2_id":"CIV","team1_score":3,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":30,"day":"Monday 21 June 2010","hour":"13:30","stadium":"6","group":"G","team1_id":"POR","team2_id":"PRK","team1_score":7,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":31,"day":"Monday 21 June 2010","hour":"16:00","stadium":"9","group":"H","team1_id":"CHI","team2_id":"SUI","team1_score":1,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":32,"day":"Monday 21 June 2010","hour":"20:30","stadium":"2","group":"H","team1_id":"ESP","team2_id":"HON","team1_score":2,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":33,"day":"Tuesday 22 June 2010","hour":"16:00","stadium":"4","group":"A","team1_id":"MEX","team2_id":"URU","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":34,"day":"Tuesday 22 June 2010","hour":"16:00","stadium":"5","group":"A","team1_id":"FRA","team2_id":"RSA","team1_score":1,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":35,"day":"Tuesday 22 June 2010","hour":"20:30","stadium":"7","group":"B","team1_id":"NGA","team2_id":"KOR","team1_score":2,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":36,"day":"Tuesday 22 June 2010","hour":"20:30","stadium":"8","group":"B","team1_id":"GRE","team2_id":"ARG","team1_score":0,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":37,"day":"Wednesday 23 June 2010","hour":"16:00","stadium":"9","group":"C","team1_id":"SVN","team2_id":"ENG","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":38,"day":"Wednesday 23 June 2010","hour":"16:00","stadium":"10","group":"C","team1_id":"USA","team2_id":"ALG","team1_score":1,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":39,"day":"Wednesday 23 June 2010","hour":"20:30","stadium":"1","group":"D","team1_id":"GHA","team2_id":"GER","team1_score":0,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":40,"day":"Wednesday 23 June 2010","hour":"20:30","stadium":"3","group":"D","team1_id":"AUS","team2_id":"SRB","team1_score":2,"team2_score":1,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":41,"day":"Thursday 24 June 2010","hour":"16:00","stadium":"2","group":"F","team1_id":"SVK","team2_id":"ITA","team1_score":3,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":42,"day":"Thursday 24 June 2010","hour":"16:00","stadium":"8","group":"F","team1_id":"PAR","team2_id":"NZL","team1_score":0,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":43,"day":"Thursday 24 June 2010","hour":"20:30","stadium":"4","group":"E","team1_id":"DEN","team2_id":"JPN","team1_score":1,"team2_score":3,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":44,"day":"Thursday 24 June 2010","hour":"20:30","stadium":"6","group":"E","team1_id":"CMR","team2_id":"NED","team1_score":1,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":45,"day":"Friday 25 June 2010","hour":"16:00","stadium":"7","group":"G","team1_id":"POR","team2_id":"BRA","team1_score":0,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":46,"day":"Friday 25 June 2010","hour":"16:00","stadium":"3","group":"G","team1_id":"PRK","team2_id":"CIV","team1_score":0,"team2_score":3,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":47,"day":"Friday 25 June 2010","hour":"20:30","stadium":"10","group":"H","team1_id":"CHI","team2_id":"ESP","team1_score":1,"team2_score":2,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":48,"day":"Friday 25 June 2010","hour":"20:30","stadium":"5","group":"H","team1_id":"SUI","team2_id":"HON","team1_score":0,"team2_score":0,"phase":"G","team1_scorePK":null,"team2_scorePK":null},
        {"id":49,"day":"Saturday 26 June 2010","hour":"16:00","stadium":"9","team1_id":"URU","team2_id":"KOR","team1_source":"1A","team2_source":"2B","team1_score":2,"team2_score":1,"phase":"H","team1_scorePK":null,"team2_scorePK":null},
        {"id":50,"day":"Saturday 26 June 2010","hour":"20:30","stadium":"4","team1_id":"USA","team2_id":"GHA","team1_source":"1C","team2_source":"2D","team1_score":1,"team2_score":2,"phase":"H","team1_scorePK":null,"team2_scorePK":null},
        {"id":51,"day":"Sunday 27 June 2010","hour":"16:00","stadium":"5","team1_id":"GER","team2_id":"ENG","team1_source":"1D","team2_source":"2C","team1_score":4,"team2_score":1,"phase":"H","team1_scorePK":null,"team2_scorePK":null},
        {"id":52,"day":"Sunday 27 June 2010","hour":"20:30","stadium":"1","team1_id":"ARG","team2_id":"MEX","team1_source":"1B","team2_source":"2A","team1_score":3,"team2_score":1,"phase":"H","team1_scorePK":null,"team2_scorePK":null},
        {"id":53,"day":"Monday 28 June 2010","hour":"16:00","stadium":"7","team1_id":"NED","team2_id":"SVK","team1_source":"1E","team2_source":"2F","team1_score":2,"team2_score":1,"phase":"H","team1_scorePK":null,"team2_scorePK":null},
        {"id":54,"day":"Monday 28 June 2010","hour":"20:30","stadium":"2","team1_id":"BRA","team2_id":"CHI","team1_source":"1G","team2_source":"2H","team1_score":3,"team2_score":0,"phase":"H","team1_scorePK":null,"team2_scorePK":null},
        {"id":55,"day":"Tuesday 29 June 2010","hour":"16:00","stadium":"10","team1_id":"PAR","team2_id":"JPN","team1_source":"1F","team2_source":"2E","team1_score":0,"team2_score":0,"phase":"H","team1_scorePK":5,"team2_scorePK":3},
        {"id":56,"day":"Tuesday 29 June 2010","hour":"20:30","stadium":"6","team1_id":"ESP","team2_id":"POR","team1_source":"1H","team2_source":"2G","team1_score":1,"team2_score":0,"phase":"H","team1_scorePK":null,"team2_scorePK":null},
        {"id":57,"day":"Friday 02 July 2010","hour":"16:00","stadium":"9","team1_id":"NED","team2_id":"BRA","team1_source":"W53","team2_source":"W54","team1_score":2,"team2_score":1,"phase":"Q","team1_scorePK":null,"team2_scorePK":null},
        {"id":58,"day":"Friday 02 July 2010","hour":"20:30","stadium":"1","team1_id":"URU","team2_id":"GHA","team1_source":"W49","team2_source":"W50","team1_score":1,"team2_score":1,"phase":"Q","team1_scorePK":4,"team2_scorePK":2},
        {"id":59,"day":"Saturday 03 July 2010","hour":"16:00","stadium":"6","team1_id":"GER","team2_id":"ARG","team1_source":"W51","team2_source":"W52","team1_score":4,"team2_score":0,"phase":"Q","team1_scorePK":null,"team2_scorePK":null},
        {"id":60,"day":"Saturday 03 July 2010","hour":"20:30","stadium":"2","team1_id":"PAR","team2_id":"ESP","team1_source":"W55","team2_source":"W56","team1_score":0,"team2_score":1,"phase":"Q","team1_scorePK":null,"team2_scorePK":null},
        {"id":61,"day":"Tuesday 06 July 2010","hour":"20:30","stadium":"6","team1_id":"NED","team2_id":"URU","team1_source":"W57","team2_source":"W58","team1_score":3,"team2_score":2,"phase":"S","team1_scorePK":null,"team2_scorePK":null},
        {"id":62,"day":"Wednesday 07 July 2010","hour":"20:30","stadium":"7","team1_id":"GER","team2_id":"ESP","team1_source":"W59","team2_source":"W60","team1_score":0,"team2_score":1,"phase":"S","team1_scorePK":null,"team2_scorePK":null},
        {"id":63,"day":"Saturday 10 July 2010","hour":"20:30","stadium":"9","team1_id":"URU","team2_id":"GER","team1_source":"L61","team2_source":"L62","team1_score":2,"team2_score":3,"phase":"T","team1_scorePK":null,"team2_scorePK":null},
        {"id":64,"day":"Sunday 11 July 2010","hour":"20:30","stadium":"1","team1_id":"NED","team2_id":"ESP","team1_source":"W61","team2_source":"W62","team1_score":0,"team2_score":1,"phase":"F","team1_scorePK":null,"team2_scorePK":null}
    ]);
