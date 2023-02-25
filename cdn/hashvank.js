const fs = require('fs')
const css = require('css')

const getJSCode = (videos, inputCode, callBack) => {

    return new Promise(async (resovle, reject) => {

        const cssText = fs.readFileSync(__dirname+'/hashvank.css', 'utf8')
        const obj = css.parse(cssText)
        const result = css.stringify(obj)

        let videoViews = []
        if(videos.length > 0) {
            videos.forEach(vd => {
                const vid = vd.get({ plain: true })
                let linkSettings = vid.linkSettings

                if(callBack && callBack === 'parseArray') {
                    videoViews.push(vid.videoUrl)
                } else {
                    
                    const lsArray = []
                    linkSettings.forEach((ls) => {
                        const layout = `
                                    <li class="hashvank-vd-wr-info-list-item">
                                        <a href="${ls.pageURL}" target="_blank" rel="noopener">
                                            <figure>
                                                <img src="${ls.imageURL}" alt="${ls.title}" />
                                            </figure>
                                            <div class="hashvank-vd-wr-info-list-item-txt">
                                                <h3>${ls.title}</h3>
                                                <p>${ls.hashtag}</p>
                                            </div>
                                        </a>
                                    </li>
                                `
                        lsArray.push(layout)
                    })

                    videoViews.push(`
                        <div class="hashvank-vd-wr">
                            <video autoplay muted loop onclick="showItem(this)"><source type="video/mp4" src="${vid.videoURL}" /></video>
                            <div class="hashvank-vd-wr-info">
                                <ul class="hashvank-vd-wr-info-list">
                                    ${lsArray.join('')}
                                </ul>
                            </div>
                        </div>
                    `)
                }
            });
            
        }

        if(videoViews.length === 0) {
            return null
        }

        let jsCodes = `
            const defaultSetting = {
                layoutType: ${inputCode.layoutType},
                layoutWrapper: document.querySelector('#hashvank'),
            };
            let videoViewsArray = ${JSON.stringify(videoViews)}; 
            function parseHTML() {
                if(typeof hashvank != "undefined") {

                    if('layoutType' in hashvank) {
                        videoViewsArray = videoViewsArray.slice( 0, hashvank.layoutType)
                    } else {
                        videoViewsArray = videoViewsArray.slice( 0, defaultSetting.layoutType)
                    }
        
                    if('layoutWrapper' in hashvank) {
                        hashvank.layoutWrapper.innerHTML = '<div class="hashvank-vd">'+videoViewsArray.join(' ')+'</div>'; 
                    } else {
                        defaultSetting.layoutWrapper.innerHTML = '<div  class="hashvank-vd">'+videoViewsArray.join(' ')+'</div>'; 
                    }
        
                } else {
                    
                }
            }
            function parseArray() {
                if(typeof hashvank != "undefined") {

                    if('layoutType' in hashvank) {
                        videoViewsArray = videoViewsArray.slice( 0, hashvank.layoutType)
                    } else {
                        videoViewsArray = videoViewsArray.slice( 0, defaultSetting.layoutType)
                    }
                    
                    hashvank.response = videoViewsArray;
        
                } else {
                    
                }
            }
            function showItem(vd) {
                if(vd.nextElementSibling.classList.contains('active')) {
                    vd.nextElementSibling.classList.remove('active');
                } else {
                    vd.nextElementSibling.classList.add('active');
                }
            }
            
        `

        if(callBack && callBack === 'parseArray') {
            jsCodes += `parseArray();`
        } else {
            jsCodes += `parseHTML();`
        }

        jsCodes += `
            const styleTag = document.createElement("style");
            styleTag.innerHTML = ${JSON.stringify(result)};
            document.querySelector("head").appendChild(styleTag);
        `

        resovle(jsCodes)

    })
    
    
}


module.exports = {
    getJSCode,
}