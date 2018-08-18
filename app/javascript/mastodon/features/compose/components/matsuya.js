import React from 'react';
import { Link } from 'react-router-dom';


class MatsuyaComponent extends React.PureComponent {
  constructor() {
    super();
    this.rendering_state = this.getToday();
  }

  componentWillUnmount() {
    this.cancelPolling();
  }

  setPolling = () => {
    this.timer = setTimeout(this.refresh, 1000);
  }

  cancelPolling = () => {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  refresh = () => {
    this.timer = null;
    const now = getToday();
    if (now > this.rendering_state) {
      this.rendering_state = now;
      this.forceUpdate();
    }
    this.setPolling();
  }

  getToday = () => {
    return Math.floor((new Date() - new Date(1998, 7, 25, 0, 0, 0)) / 24 / 3600 / 1000);
  }
}


class Matsuya1 extends MatsuyaComponent {
  render() {
    const menu = [
      {
        "name": "プレミアム牛めし",
        "price": "並: 380円, 大: 530円",
        "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyu_hp.html",
      },
      {
        "name": "ネギたっぷりプレミアム旨辛ネギたま牛めし",
        "price": "並: 490円, 大: 640円",
        "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyu_negitama_hp.html",
      },
      {
        "name": "プレミアムおろしポン酢牛めし",
        "price": "並: 480円, 大: 630円",
        "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyuu_oroshi_hp.html",
      },
    ];

    const item = menu[this.getToday() % menu.length];
    const header = (<strong>今日の松屋</strong>);
    const content = (<div className='matsuya__content'><strong>{item["name"]}</strong>{item["price"]}</div>);
    if ("url" in item) {
      return (<a href={item["url"]} target='_blank' className='matsuya__item'>{header}{content}</a>);
    } else {
      return (<div className='matsuya__item'>{header}{content}</div>);
    }
  }
}


class Matsuya2 extends MatsuyaComponent {
  render() {
    const menu = [
      {
        "name": "プレミアム牛めし",
        "price": "並: 380円, 大: 530円",
        "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyu_hp.html",
      },
      {
        "name": "ネギたっぷりプレミアム旨辛ネギたま牛めし",
        "price": "並: 490円, 大: 640円",
        "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyu_negitama_hp.html",
      },
      {
        "name": "プレミアムおろしポン酢牛めし",
        "price": "並: 480円, 大: 630円",
        "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyuu_oroshi_hp.html",
      },
      {
        "name": "キムカル丼",
        "price": "並: 500円, 大: 600円",
        "url": "https://www.matsuyafoods.co.jp/menu/don/don_kimukaru_180403.html",
      },
      {
        "name": "ネギたっぷりネギ塩豚カルビ丼",
        "price": "並: 450円, 大: 550円",
        "url": "https://www.matsuyafoods.co.jp/menu/don/don_negishiobuta.html",
      },
      {
        "name": "塩キャベツ豚丼",
        "price": "並: 550円, 大: 610円",
        "url": "https://www.matsuyafoods.co.jp/menu/don/don_shio_kyabetsu_hp.html",
      },
      {
        "name": "オリジナルカレー",
        "price": "並: 380円, 大: 480円",
        "url": "https://www.matsuyafoods.co.jp/menu/curry/cri_ori_170307.html",
      },
      {
        "name": "ぶっかけ担々うどん",
        "price": "400円",
        "url": "https://www.matsuyafoods.co.jp/menu/udoon/udon_hiya_tantan_180807.html",
      },
      {
        "name": "ぶっかけ肉おろしうどん（プレミアム牛肉使用）",
        "price": "480円",
        "url": "https://www.matsuyafoods.co.jp/menu/udoon/udon_hiya_p_niku_oroshi.html",
      },
      {
        "name": "ぶっかけとろたまうどん",
        "price": "400円",
        "url": "https://www.matsuyafoods.co.jp/menu/udoon/udon_hiya_torotama_160510.html",
      },
    ];

    const item = menu[this.getToday() % menu.length];
    const header = (<strong>本日の松屋</strong>);
    const content = (<div className='matsuya__content'><strong>{item["name"]}</strong>{item["price"]}</div>);
    if ("url" in item) {
      return (<a href={item["url"]} target='_blank' className='matsuya__item'>{header}{content}</a>);
    } else {
      return (<div className='matsuya__item'>{header}{content}</div>);
    }
  }
}


export default class Matsuya extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    return (<div>
      <Matsuya1 />
      <Matsuya2 />
    </div>);
  }
}
