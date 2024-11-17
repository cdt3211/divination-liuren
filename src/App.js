import LiurenDivination from "./components/xiaoLiuRen";
import './style.scss';
import { Layout, Typography } from 'antd';
import { op } from './utils/op';
import { useEffect } from "react";

const { Link } = Typography;



const { Footer, Content } = Layout;

function App() {
  useEffect(() => {
    op.trackPageView();
  }, []);
  return (
    <Layout className="app">
      {/* <Header className="header"></Header> */}
      <Content>
        <div className="site-layout-content">
          <div className="content">
            {LiurenDivination()}
          </div>
        </div>
      </Content>
      <Footer className="footer">
        <p>© 2024 by <Link href="https://github.com/cdt3211" target="_blank">Abner</Link></p>
      </Footer>
    </Layout>
  );
}

export default App;
