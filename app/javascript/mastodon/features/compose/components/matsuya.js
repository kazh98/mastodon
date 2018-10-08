import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import axios from 'axios';


const defaultMatsuyaJSON = [
  {
    "name": "プレミアム牛めし",
    "price": "並: 380円, 大: 530円",
    "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyu_hp.html"
  },
  {
    "name": "ネギたっぷりプレミアム旨辛ネギたま牛めし",
    "price": "並: 490円, 大: 640円",
    "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyu_negitama_hp.html"
  },
  {
    "name": "プレミアムおろしポン酢牛めし",
    "price": "並: 480円, 大: 630円",
    "url": "https://www.matsuyafoods.co.jp/menu/pre_gyuu/pre_gyuu_oroshi_hp.html"
  },
  {
    "name": "キムカル丼",
    "price": "並: 500円, 大: 600円",
    "url": "https://www.matsuyafoods.co.jp/menu/don/don_kimukaru_180403.html"
  },
  {
    "name": "ネギたっぷりネギ塩豚カルビ丼",
    "price": "並: 450円, 大: 550円",
    "url": "https://www.matsuyafoods.co.jp/menu/don/don_negishiobuta.html"
  },
  {
    "name": "塩キャベツ豚丼",
    "price": "並: 550円, 大: 610円",
    "url": "https://www.matsuyafoods.co.jp/menu/don/don_shio_kyabetsu_hp.html"
  },
  {
    "name": "オリジナルカレー",
    "price": "並: 380円, 大: 480円",
    "url": "https://www.matsuyafoods.co.jp/menu/curry/cri_ori_170307.html"
  },
  {
    "name": "カレギュウ（プレミアム牛肉使用）",
    "price": "並: 590円, 大: 690円",
    "url": "https://www.matsuyafoods.co.jp/menu/curry/cry_ori_gyu_p_170307.html"
  },
  {
    "name": "ハンバーグカレー",
    "price": "並: 590円, 大: 690円",
    "url": "https://www.matsuyafoods.co.jp/menu/curry/cry_ori_hb_170307.html"
  },
  {
    "name": "牛焼肉定食",
    "price": "600円 (W定食: 900円)",
    "url": "https://www.matsuyafoods.co.jp/menu/teishoku/tei_gyuuyaki_180403_hp.html"
  },
  {
    "name": "カルビ焼肉定食",
    "price": "650円 (W定食: 950円)",
    "url": "https://www.matsuyafoods.co.jp/menu/teishoku/tei_karubi_180403_hp.html"
  },
  {
    "name": "豚バラ焼肉定食",
    "price": "550円 (W定食: 850円)",
    "url": "https://www.matsuyafoods.co.jp/menu/teishoku/tei_bara_yakiniku_hp.html"
  },
  {
    "name": "豚バラ生姜焼定食",
    "price": "590円 (W定食: 890円)",
    "url": "https://www.matsuyafoods.co.jp/menu/teishoku/tei_shouga_hp.html"
  },
  {
    "name": "ぶっかけ担々うどん",
    "price": "400円",
    "url": "https://www.matsuyafoods.co.jp/menu/udoon/udon_hiya_tantan_180807.html"
  },
  {
    "name": "ぶっかけ肉おろしうどん（プレミアム牛肉使用）",
    "price": "480円",
    "url": "https://www.matsuyafoods.co.jp/menu/udoon/udon_hiya_p_niku_oroshi.html"
  },
  {
    "name": "ぶっかけとろたまうどん",
    "price": "400円",
    "url": "https://www.matsuyafoods.co.jp/menu/udoon/udon_hiya_torotama_160510.html"
  }
];


class MatsuyaItem extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    name:  PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    url:   PropTypes.string,
  }

  render() {
    const { title, name, price, url } = this.props;

    const header = (<strong>{title}</strong>);
    const content = (<div className='matsuya__content'><strong>{name}</strong>{price}</div>);
    if (url) {
      return (<a href={url} target='_blank' className='matsuya__item'>{header}{content}</a>);
    } else {
      return (<div className='matsuya__item'>{header}{content}</div>);
    }
  }
}


class MatsuyaComponent extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url:   PropTypes.string.isRequired,
  }

  state = {
    item: {"name": "読み込み中...", price: "---円"},
  }

  constructor(props) {
    super(props);
    this.rendering_state = 0;
    this.cache = null;
    this.cachedp = false;
    this.cache_date = null;
    this.refresh();
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

  deleteServiceWorkerCache = () => {
    // files in /system will be cached by ServiceWorker
    if (self.caches) {
      const { url } = this.props;
      return caches.open('mastodon-system')
        .then(cache => cache.delete(window.origin + url))
        .catch(() => {});
    } else {
      return Promise.resolve();
    }
  }

  refresh = () => {
    this.timer = null;
    const now = this.getToday();
    if (now > this.rendering_state) {
      this.rendering_state = now;
      const { url } = this.props;
      axios.get(url, {
        headers: {
          'If-Modified-Since': !this.cachedp && this.cache_date || '',
        }
      })
      .then(resp => {
        this.cachedp = !!resp.headers['cache-control'];
        this.cache_date = resp.headers['last-modified'];
        return resp;
      })
      .then(resp => {
        this.cache = resp.data;
        if (!this.cache) {
          this.cache = defaultMatsuyaJSON;
        }
        return this.setState({item: this.choice(now, this.cache)});
      })
      .catch(e => {
        if (e.response.status === 304 && this.cache) {
          return this.setState({item: this.choice(now, this.cache)});
        } else {
          return this.setState({item: this.choice(now, defaultMatsuyaJSON)});
        }
      })
      .then(this.deleteServiceWorkerCache)
      .then(this.setPolling)
      .catch(e => e && console.warn(e));
    } else {
      this.setPolling();
    }
  }

  getToday = () => {
    return Math.floor((new Date() - new Date(1998, 7, 25, 0, 0, 0)) / 24 / 3600 / 1000);
  }

  choice = (state, data) => {
    return data[state % data.length];
  }

  render() {
    const { title } = this.props;
    const { item } = this.state;
    if ("url" in item) {
      return (<MatsuyaItem title={title} name={item["name"]} price={item["price"]} url={item["url"]} />);
    } else {
      return (<MatsuyaItem title={title} name={item["name"]} price={item["price"]} />);
    }
  }
}


export default class Matsuya extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    return (<div>
      <MatsuyaComponent title='今日の松屋' url='/system/matsuya1.json' />
      <MatsuyaComponent title='本日の松屋' url='/system/matsuya2.json' />
      <MatsuyaComponent title={"Today's 松屋"} url='/system/matsuya3.json' />
    </div>);
  }
}
