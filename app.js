//入門３－３の勉強用ファイル

'use strict';
const fs = require('fs'); //fsモジュールを読み込む
const readline = require('readline');  //readlineモジュールを読み込む

const rs = fs.createReadStream('./popu-pref.csv');
//fsモジュールに用意されているStreamでファイルを開く？メソッド
//このファイルを読み込んで、Streamを生成している

const rl = readline.createInterface({ 'input': rs, 'output': {} });
//生成したStreamを一行ずつ読み込むためにreadlineモジュールに渡している
//ここまでで一行ずつ読めるようになった

const prefectureDataMap = new Map(); //key:都道府県,value:集計データ

rl.on('line', (linestring) => {
    const columns = linestring.split(','); //split()メソッドでカンマの箇所で分割して配列に変換
    const year = parseInt(columns[0]); //計算できるようにparseInt()関数で整数に変換
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) { //if文で2010年と2015年のデータのみにする
        let value = prefectureDataMap.get(prefecture);
        //まず、都道府県のデータを取っている？データをチェックしている？

        if (!value) { //valueの値がFalsyであれば、データをつくると。
            value = {
                popu10: 0,
                popu15: 0,
                change: null //これが変化率
            };
        }
        //上書きするようにして、先に形だけ作っている

        if (year === 2010) {
            value.popu10 = popu;
        }
        //2010年のデータだったらvalue.popu10に入れる

        if (year === 2015) {
            value.popu15 = popu;
        }
        //2015年のデータだったらvalue.popu15に入れる

        prefectureDataMap.set(prefecture,value);
        //入れた人口データを連想配列に保存
    }
});
//rlオブジェクトでlineイベント（一行読んだ）が発生した場合
//無名関数を呼び出す
//lineStringには読み込んだ一行の文字列が入っている

rl.on('close', () => {
    for (let [key,value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    //for-of構文でprefectureDataMapの中身を変数に代入
    //valueオブジェクトのchangeプロパティに変化率を代入

    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    //連想配列を配列に変換し、sort関数を使って変化率の大きい順に並べる
    //後者のオブジェクトの変化率が大きければ入れ替える？

    const rankingStrings = rankingArray.map(([key,value]) => {
        return `${key}: ${value.popu10} -> ${value.popu15} 変化率: ${value.change}`;
    });
    //map関数で配列の要素を受け取り、文字列を含めて見やすいように変換している


    console.log(rankingStrings);
});

