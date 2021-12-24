				//��ʼ��WebGL Canvas�ķ���
				function initWebGLCanvas(canvasName)
				{
				    var canvas = document.getElementById(canvasName);//��ȡCanvas����
				    var names = ["webgl2"];
	          		var context = null;//���������ı���
				    for (var ii = 0; ii < names.length; ++ii) //�������ܵ�GL����������
				    {
					    try 
					    {
					      context = canvas.getContext(names[ii], null);	//��ȡGL������			      
					    } 
					    catch(e) {}
					    if (context) //���ɹ���ȡGL����������ֹѭ��
					    {
					      break;
					    }
				    }			
					console.log('context', context)    
				    return context;//����GL�����Ķ���
				}
	
				// //���ص�����ɫ���ķ���			
				// function loadSingleShader(ctx, shaderScript)
				// {
				// 	if (shaderScript.type == "vertex")//��Ϊ������ɫ��
				// 		var shaderType = ctx.VERTEX_SHADER;//������ɫ������
				// 	else if (shaderScript.type == "fragment")//��ΪƬԪ��ɫ��
				// 		var shaderType = ctx.FRAGMENT_SHADER;//ƬԪ��ɫ������
				// 	else {//�����ӡ������Ϣ
				// 		console.log("*** Error: shader script of undefined type '"+shaderScript.type+"'");
				// 		return null;
				// 	}

				// 	//�������ʹ�����ɫ������
				// 	var shader = ctx.createShader(shaderType);

				// 	//������ɫ���ű�
				// 	ctx.shaderSource(shader, shaderScript.text);

				// 	//������ɫ��
				// 	ctx.compileShader(shader);

				// 	//������״̬
				// 	var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
				// 	if (!compiled && !ctx.isContextLost()) {//���������
				// 		var error = ctx.getShaderInfoLog(shader);//��ȡ������Ϣ
				// 		console.log("*** Error compiling shader '"+shader+"':"+error);//��ӡ������Ϣ
				// 		ctx.deleteShader(shader);//ɾ����ɫ������
				// 		console.log('--------------------------------------------------------------------')

				// 		return null;//���ؿ�
				// 	}			
				// 	return shader;//������ɫ������
				// }	
				
				// //�������Ӷ��㡢ƬԪ��ɫ���ķ���
				// function loadShaderSerial(gl, vshader, fshader)
				// {
				//     //���ض�����ɫ��
				//     var vertexShader = loadSingleShader(gl, vshader);
				//     //����ƬԪ��ɫ��
				//     var fragmentShader = loadSingleShader(gl, fshader);
				// 	console.log(fragmentShader)
				//     //������ɫ������
				//     var program = gl.createProgram();
				
				//     //��������ɫ����ƬԪ��ɫ���ҽӵ���ɫ������
				//     gl.attachShader (program, vertexShader);//��������ɫ����ӵ���ɫ��������
				//     gl.attachShader (program, fragmentShader);//��ƬԪ��ɫ����ӵ���ɫ��������
				
				//     //������ɫ������
				//     gl.linkProgram(program);
				
				//     //��������Ƿ�ɹ�
				//     var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
				//     if (!linked && !gl.isContextLost())//�����Ӳ��ɹ� 
				//     {
				//         //��ȡ���ڿ���̨��ӡ������Ϣ
				//         var error = gl.getProgramInfoLog (program);//��ȡ������Ϣ
				//         console.log("Error in program linking:"+error);//��ӡ������Ϣ
				
				//         gl.deleteProgram(program);//ɾ����ɫ������
				//         gl.deleteProgram(fragmentShader);//ɾ��ƬԪ��ɫ��
				//         gl.deleteProgram(vertexShader);//ɾ��������ɫ��
				
				//         return null;//���ؿ�
				//     }
				// 	gl.useProgram(program);
				// 	gl.enable(gl.DEPTH_TEST);
				//     return program;//������ɫ������
				// }				
				
				// function compileShader(gl, shaderType, sourceCode) {
				// 	const shader = gl.createShader(shaderType);
				// 	if (!shader) {
				// 	  throw new Error(`Could not create shader for type: ${shaderType}`);
				// 	}
				  
				// 	gl.shaderSource(shader, sourceCode);
				// 	gl.compileShader(shader);
				  
				// 	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				// 	  const info = gl.getShaderInfoLog(shader);
				// 	  throw Error(`Could not compile WebGL program. \n\n${info}`);
				// 	}
				  
				// 	return shader
				// }