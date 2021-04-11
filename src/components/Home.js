import React from 'react';
import { Button, Card, List, message, Tabs, Tooltip } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { addFavoriteItem, deleteFavoriteItem } from '../utils';

const { TabPane } = Tabs;
//const TabPane = Tabs.TabPane;

const tabKeys = {
    Streams: 'streams',
    Videos: 'videos',
    Clips: 'clips',
}

const processUrl = (url) => url
.replace('%{height}', '252')
.replace('%{width}', '480')
.replace('{height}', '252')
.replace('{width}', '480')

const renderCardTitle = (item, loggedIn, favs, favOnChange) => {
    const title = `${item.broadcaster_name} - ${item.title}`;
    const isFav = favs.find((fav) => fav.id === item.id);//找item在不在fav list里，这里返回值不是boolean，是item
   
    const favOnClick = () => {
        if (isFav) {
            deleteFavoriteItem(item).then(() => {
                favOnChange();
            }).catch((err) => {
                message.error(err.message);
            })
            return;
        }
        addFavoriteItem(item).then(() => {
            favOnChange();
        }).catch((err) => {
            message.error(err.message);
        })        
    }
    
    return (
        <>
            {
                loggedIn && 
                <Tooltip title={isFav ? "Remove from favorite list" : "Add to favorite list"}>
                    <Button shape="circle" icon={isFav ? <StarFilled /> : <StarOutlined />} onClick={favOnClick}/>
                </Tooltip>
                // <Tooltip title="Add to favorite list">
                //     <Button shape="circle" icon={<StarOutlined />} />
                // </Tooltip>
            }
            <div style={{overflow: 'hidden', textOverflow: 'ellipsis', width: 450}}>
                <Tooltip title={title}>
                    <span>{title}</span>
                </Tooltip>
            </div>
        </>
    )
}

//Responsive grid list
const renderCardGrid = (data, loggedIn, favs, favOnChange) => {
    return(
        <List 
            grid={{//根据屏幕像素决定一行显示几个
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
            }}
            dataSource={data}
            renderItem={item => (
                <List.Item style={{ marginRight: '20px'}}>
                    <Card
                        title={renderCardTitle(item, loggedIn, favs, favOnChange)}
                    >
                        <a href={item.url} target='_blank' rel="noopener noreferrer">
                            <img
                                alt="Placeholder"
                                src={processUrl(item.thumbnail_url)}
                            />
                        </a>
                    </Card>
                </List.Item>
            )}        
        />
    )
}

// const funComponent = (props) => {//destructing
//     const { resources, loggedIn } = props;
// }

//功能单一化，纯负责显示，数据由parent传入
//没有state,所以这里用了function component
//key,如果有onChange callback, 需要知道key
//forceRender，当没有点到其他tab时，DOM也update
//写成function
//{renderCardGrid(STREAM, loggedIn, favStreams, favoriteOnChange)}
//或者写成component
//<CardGrid />
//基本上没有state的都可以写成function,看组里的习惯
const Home = ({ resources, loggedIn, favoriteItems, favoriteOnChange }) => {
    const { VIDEO, STREAM, CLIP } = resources;
    const { VIDEO: favVidoes, STREAM: favStreams, CLIP: favClips} = favoriteItems;
   
    return (
      <Tabs 
        defaultActiveKey={tabKeys.Streams} 
      >
        <TabPane tab="Streams" key={tabKeys.Streams} style={{ height: '680px', overflow: 'auto' }} forceRender={true}>
          {renderCardGrid(STREAM, loggedIn, favStreams, favoriteOnChange)}
        </TabPane>
        <TabPane tab="Videos" key={tabKeys.Videos} style={{ height: '680px', overflow: 'auto' }} forceRender={true}>
          {renderCardGrid(VIDEO, loggedIn, favVidoes, favoriteOnChange)}
        </TabPane>
        <TabPane tab="Clips" key={tabKeys.Clips} style={{ height: '680px', overflow: 'auto' }} forceRender={true}>
          {renderCardGrid(CLIP, loggedIn, favClips, favoriteOnChange)}
        </TabPane>
      </Tabs>
    );
}
   
export default Home;