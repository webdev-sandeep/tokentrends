import React, { useEffect, useState } from "react";
import { Select, Typography, Card, Row, Col, Avatar } from "antd";
import moment from "moment";
import { useGetNewsQuery } from "../services/newsApi";
import { useGetCryptosQuery } from "../services/cryptoApi";

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const count = simplified ? 8 : 32;
  const [newsCategory, setNewsCategory] = useState("Cryptocurrency");
  const { data: cryptoNews, isFetching } = useGetNewsQuery({
    newsCategory: newsCategory,
    count: count,
  });
  const { data: cryptoData } = useGetCryptosQuery(100);
  const [news, setNews] = useState([]);
  const demoImage =
    "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News";

  useEffect(() => {
    setNews(cryptoNews?.value);
  }, [cryptoNews]);

  if (isFetching) {
    return <h1>Loading...</h1>;
  }
  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a news category"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {cryptoData?.data?.coins?.map((crypto) => {
              return <Option value={crypto?.name}>{crypto?.name}</Option>;
            })}
          </Select>
        </Col>
      )}
      {news?.map((news, i) => {
        return (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card hoverable className="news-card">
              <a href={news?.url} target="_blank" rel="noreferrer">
                <div className="news-image-container">
                  <Title className="news-title" level={4}>
                    {news?.name}
                  </Title>
                  <img
                    src={news?.image?.thumbnail?.contentUrl || demoImage}
                    alt="crypto-news"
                    style={{ maxHeight: "100px", maxWidth: "200px" }}
                  />
                </div>
                <p>
                  {news?.description?.length > 100
                    ? news?.description?.substring(0, 100) + "..."
                    : news?.description}
                </p>
                <div className="provider-container">
                  <div>
                    <Avatar
                      src={
                        news?.provider[0]?.image?.thumbnail?.contentUrl ||
                        demoImage
                      }
                    />
                    <Text className="provider-name">
                      {news?.provider[0]?.name}
                    </Text>
                  </div>
                  <Text>
                    {moment(news?.datePublished).startOf("seconds").fromNow()}
                  </Text>
                </div>
              </a>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default News;
