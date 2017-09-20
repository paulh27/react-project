import React, {Component} from 'react';
import {Form, Input, Button, Select} from 'antd';

import Ueditor from '../ueditor';
import {SERVER_ADDRESS} from '../../config/config';


const FormItem = Form.Item;
const Option = Select.Option;

class GatherDeatil extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gather: {},
			content: ''
		}
	}

	static contextTypes = {
 		router: React.PropTypes.object
	}
	
	componentDidMount() {
		let id = this.props.id;

		if(id != null) {
			fetch(`${SERVER_ADDRESS}/gather/${id}`).then((response) => {
				
				if(response.status !== 200) {
					throw new Error('Load Failed, Status:' + response.status);
					this.setState({error: "Load Failed"});
				}

				response.json().then((responseJson) => {
					if(responseJson.status == 0) {
						this.setState({error: responseJson.message});
					}
					else {
						this.setState({gather: responseJson.info});
					}
				}).catch((error) => {
					this.setState({error: "Load Failed"});
				})
				
			}).catch((error) => {
				this.setState({error: "Load Failed"});
			});
		}
	}
	
	handleChange = (content) => {
		this.state.content = content;
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let content = this.state.content;

				if(content.trim() == '') {
					alert('收藏内容为空！');
					return;
				}

				values.id = this.props.id;
				values.content = content;

				fetch(`${SERVER_ADDRESS}/gather-submit`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(values)
				}).then((response) => {
					
					if(response.status !== 200) {
						throw new Error('Failed, Status:' + response.status);
						this.setState({error: "Load Failed"});
					}
	
					response.json().then((responseJson) => {
						if(responseJson.status == 0) {
							this.setState({error: responseJson.message});
						}
						else {
							alert("收藏提交成功！");
							if(this.props.id == null) {
								this.context.router.push(`/gather`);
							}
						}
					}).catch((error) => {
						this.setState({error: "Load Failed"});
					})
					
				}).catch((error) => {
					this.setState({error: "Load Failed"});
				});
			}
		});
	}

	render() {
		let {title, tag, detail} = this.state.gather;
		const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

		const tagError = isFieldTouched('tag') && getFieldError('tag');
		const titleError = isFieldTouched('title') && getFieldError('title');

		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<FormItem
						validateStatus={titleError ? 'error' : ''}
						help={titleError || ''}
						label="标题"
					>
					{
						getFieldDecorator('title', {
							initialValue: title,
							rules: [{required: true, message: 'Please input title!'}]
						})(
							<Input placeholder="title" style={{width: 400}}/>
						)
					}
					</FormItem>
					<FormItem
						validateStatus={tagError ? 'error' : ''}
						help={tagError || ''}
						label="标签"
					>
					{
						getFieldDecorator('tag', {
							initialValue: tag,
							rules: [{required: true, message: 'Please input tag!'}]
						})(
							<Input placeholder="tag" style={{width: 250}}/>
						)
					}
					</FormItem>
					<Ueditor content={detail} handleChange={this.handleChange} />
					<div style={{textAlign: "right"}}>
						<FormItem>
							<Button type="primary" htmlType="submit">
								提交
							</Button>
						</FormItem>
					</div>
				</Form>
			</div>
		)
	}
}

const WrappedGatherDetail = Form.create()(GatherDeatil);

export default WrappedGatherDetail;