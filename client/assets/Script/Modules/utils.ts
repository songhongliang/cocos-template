class utilsModule {
    constructor() { }
    /**
     * 本地储存数据
     * @param key 对应的 key 值
     * @param data 对应的数据
     */
    public saveData(key: string, data: any) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * 获取本地数据
     * @param key 对应的 key 值
     */
    public fetchData(key: string): any {
        let data = window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : null;
        return data;
    }

    /** 清除本地数据 */
    public removeData() {
        window.localStorage.clear();
    }

    /** 长震动 */
    public vibrateLong() {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(400);
        } else if (window['wx'] && wx.vibrateLong) {
            wx.vibrateLong();
        }
    }

    /** 短震动 */
    public vibrateShort() {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(15);
        } else if (window['wx'] && wx.vibrateShort) {
            wx.vibrateShort();
        }
    }

    /**
     * 时间戳生成
     * @param num 天数: 0为当天，1时为明天，-1为昨天，以此类推
     */
    public timeFormat(num = 0) {
        let date: Date, month: string, day: string, hour: string, minute: string, second: string, time: string;
        date = new Date(Date.now() + (num * 24 * 3600 * 1000));
        month = ('0' + (date.getMonth() + 1)).slice(-2);
        day = ('0' + date.getDate()).slice(-2);
        hour = ('0' + date.getHours()).slice(-2);
        minute = ('0' + date.getMinutes()).slice(-2);
        second = ('0' + date.getSeconds()).slice(-2);
        time = `${date.getFullYear()}/${month}/${day} ${hour}:${minute}:${second}`;
        return time;
    }

    /**
     * 将秒数换成时分秒格式
     * @param value 秒数
     */
    public secondFormat(value: number) {
        let second: string | number = Math.floor(value),
            minute: string | number = 0,
            hour: string | number = 0;
        // 如果秒数大于60，将秒数转换成整数
        if (second > 60) {
            // 获取分钟，除以60取整数，得到整数分钟
            minute = Math.floor(second / 60);
            // 获取秒数，秒数取佘，得到整数秒数
            second = Math.floor(second % 60);
            // 如果分钟大于60，将分钟转换成小时
            if (minute > 60) {
                // 获取小时，获取分钟除以60，得到整数小时
                hour = Math.floor(minute / 60);
                // 获取小时后取佘的分，获取分钟除以60取佘的分
                minute = Math.floor(minute % 60);
            }
        }
        // 补位
        hour = ('0' + hour).slice(-2);
        minute = ('0' + minute).slice(-2);
        second = ('0' + second).slice(-2);
        return { hour, minute, second };
    }

    /**
     * 获取两个时间段的秒数
     * @param now 对比的时间
     * @param before 之前的时间
     */
    public getSecond(now: Date, before: Date): number {
        let second = (now.getTime() - before.getTime()) / 1000;
        return Math.floor(second);
    }

    /**
    * 获取两个日期之间的天数
    * @param now 现在时间
    * @param before 之前时间
    */
    public getDays(now: Date, before: Date): number {
        return Math.floor(now.getTime() - before.getTime() / 86400000);
    }

    /**
     * 过滤掉特殊符号
     * @param str 
     */
    public filterStr(str: string): number | string {
        let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
        let newStr = '';
        for (let i = 0; i < str.length; i++) {
            newStr += str.substr(i, 1).replace(pattern, '');
        }
        return newStr;
    }

    /**
     * 带单位的数值转换
     * @param value 数字
     */
    public unitsNumber(value: number = 0): string | number {
        // 取整
        value = Math.floor(value);
        if (value == 0) return 0;
        /** 单位 */
        let units = ['', 'k', 'm', 'b', 'f', 'e', 'ae', 'be', 'ce', 'de', 'ee', 'fe', 'ge', 'he', 'ie'];
        /** 索引 */
        let index = Math.floor(Math.log(value) / Math.log(1000));
        /** 结果 */
        let result: number | string = value / Math.pow(1000, index);
        if (index === 0) return result;
        result = result.toFixed(3);
        // 不进行四舍五入 取小数点后一位
        result = result.substring(0, result.lastIndexOf('.') + 2);
        return result + units[index];
    }

    /**
     * 范围随机数
     * @param min 最小数
     * @param max 最大数
     */
    public ranInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 数组中随机取几个元素
     * @param {array} arr 数组
     * @param count 元素个数
     */
    public getRandomArrayElements<T>(array: Array<T>, count: number) {
        /** 数组长度 */
        let length = array.length;
        /** 最小长度 */
        let min = length - count, temp: T, range: number;
        while (length-- > min) {
            range = Math.floor((length + 1) * Math.random());
            temp = array[range];
            array[range] = array[length];
            array[length] = temp;
        }
        return array.slice(min);
    }

    /**
     * 随机打乱数组
     * @param array
     */
    public shuffleArray<T>(array: Array<T>) {
        // 洗牌随机法（性能最优）
        for (let i = array.length - 1; i >= 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let itemAtIndex = array[randomIndex];
            array[randomIndex] = array[i];
            array[i] = itemAtIndex;
        }
        return array;
    }

    /**
     * 将指定位置的元素置顶
     * @param array 改数组
     * @param index 元素索引
     */
    public zIndexToTop<T>(array: Array<T>, index: number) {
        if (index != 0) {
            let item = array[index];
            array.splice(index, 1);
            array.unshift(item);
        } else {
            console.log('已经处于置顶');
        }
    }

    /**
     * 将指定位置的元素置底
     * @param array 改数组
     * @param index 元素索引
     */
    public zIndexToBottom<T>(array: Array<T>, index: number) {
        if (index != array.length - 1) {
            let item = array[index];
            array.splice(index, 1);
            array.push(item);
        } else {
            console.log('已经处于置底');
        }
    }

    // cocos creator >> utils =======================================================

    /**
     * 返回旋转角度 旋转的节点坐标必须为(0, 0)才可以 所以要相对应的进行转换
     * @param x 目标坐标 x
     * @param y 目标坐标 y
     */
    public rotateAngle(x: number, y: number) {
        if (y === 0) {
            if (x > 0) {
                return 90;
            }
            else if (x < 0) {
                return 270;
            }
            return 0;
        }
        if (x === 0) {
            if (y > 0) {
                return 0;
            }
            else {
                return 180;
            }
        }

        let rate = Math.atan(Math.abs(x) / Math.abs(y));
        if (x > 0 && y > 0) {
            return 360 - 180 * rate / Math.PI;
        } else if (x > 0 && y < 0) {
            return 180 + 180 * rate / Math.PI;
        } else if (x < 0 && y < 0) {
            return 180 - 180 * rate / Math.PI;
        } else if (x < 0 && y > 0) {
            return 180 * rate / Math.PI;
        }
    }

    /** 加载框 */
    private loading_box: cc.Node;
    /** 加载进度文字 */
    private loading_text: cc.Label;

    /**
     * 定义加载框 在当前场景初始化的时候执行一次
     * @param node 加载框节点
     * @param scene 加载框 输出的场景 or 节点
     */
    public setLoadingBox(node: cc.Node, scene: cc.Node) {
        this.loading_box = node;
        this.loading_box.zIndex = 99;
        this.loading_text = cc.find('text', this.loading_box).getComponent(cc.Label);
        this.loading_box.parent = scene;
        this.loading_box.active = false;
    }

    /**
     * 基础加载预制体
     * @param name 资源名字
     * @param callback 加载成功回调
     */
    public loadPrefab(name: string, callback?: (result: any) => void) {
        this.loading_box.active = true;
        this.loading_text.string = '0%';
        cc.loader.loadRes('prefab/' + name, cc.Prefab, (count, total, item) => {
            let val = count / total;
            this.loading_text.string = Math.floor(val * 100) + '%';
            // console.log(val);
        }, (err, res) => {
            this.loading_box.active = false;
            // if (err) return this.showToast('资源加载失败，请重试');
            if (callback) callback(res);
        });
    }

    /**
     * 图片加载 resources 文件下
     * @param node 节点
     * @param src 路径
     * @param callback 加载成功回调  
     */
    public loadImg(node: cc.Node = null, src: string, callback?: (result: any) => void) {
        let load_count = 0;
        /** 加载失败时，重复加载 直到次数为 3 */
        function load() {
            load_count += 1;
            cc.loader.loadRes(src, cc.SpriteFrame, (err, res) => {
                if (err) {
                    console.log(node.name + '加载次数', load_count);
                    if (load_count < 3) load();
                } else {
                    if (node) node.getComponent(cc.Sprite).spriteFrame = res;
                    if (callback) callback(res);
                }
            });
        }
        load();
    }

    /**
     * 加载网络图片
     * @param node 节点
     * @param src 资源路径
     * @param type 加载图片类型
     */
    public loadNetImg(node: cc.Node, src: string, type: string = 'jpg') {
        cc.loader.load({ url: src, type: type }, (err: any, res: any) => {
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
        });
    }
}

/** 工具模块 */
const utils = new utilsModule();

export default utils;

