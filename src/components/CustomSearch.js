import React from 'react';
import { searchGameByName } from '../utils';
import { Button, Form, Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


class CustomSearch extends React.Component {
    state = {
        displayModal: false,
    }

    handleCancel = () => {
        this.setState({
            displayModal: false,
        })
    }

    searchOnClick = () => {
        this.setState({
            displayModal: true,
        })
    }

    onSubmit = (data) => {
        searchGameByName(data.game_name).then((response) => {
            this.setState({
              displayModal: false,
            })
            //parent给child传callback
            //onSuccess由parent定义，由child调用，把response传给parent
            this.props.onSuccess(response);//把response传给 App.js 的 resources
            //console.log(response);
        }).catch((err) => {
            message.error(err.message);
        })
    }

    render = () => {
        return (
          <>
            <Button shape="round" onClick={this.searchOnClick} icon={<SearchOutlined />} style={{ marginLeft: '20px', marginTop: '20px'}}>
              Custom Search</Button>
            <Modal
              title="Custom Search"
              visible={this.state.displayModal}
              onCancel={this.handleCancel}
              footer={null}
            >
              <Form
                name="custom_search"
                onFinish={this.onSubmit}
              >
                <Form.Item
                  name="game_name"
                  rules={[{ required: true, message: 'Please enter a game name' }]}
                >
                  <Input placeholder="Game name" />
                </Form.Item>
     
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search</Button>
                </Form.Item>
              </Form>
            </Modal>
          </>
        )
    }    
}

export default CustomSearch;