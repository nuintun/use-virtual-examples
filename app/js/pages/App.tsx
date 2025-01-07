import '/css/global.scss';
import * as styles from '/css/App.module.scss';

import { Button, Result, Space } from 'antd';
import { Item, useVirtual } from 'use-virtual';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';

const size = 50;
const items = new Array(1000).fill(size);
const sizes = items.map(() => size + Math.round(Math.random() * 150));

interface VirtualItemProps {
  item: Item;
  horizontal: boolean;
}

const VirtualItem = memo(({ item: { index, size, observe }, horizontal }: VirtualItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      return observe(ref.current);
    }
  }, []);

  return (
    <div
      ref={ref}
      key={index}
      role="listitem"
      aria-posinset={index}
      style={{ [horizontal ? 'width' : 'height']: sizes[index] }}
      className={`${styles.item} ${index % 2 ? styles.dark : styles.white}`}
    >
      <span style={{ color: 'green' }}>
        📏 {index}-{size}-{sizes[index]}
      </span>
    </div>
  );
});

const VirtualList = () => {
  const { length: count } = sizes;
  const [horizontal, setHorizontal] = useState(false);
  const [viewportRef, listRef, items, { scrollToItem }] = useVirtual<HTMLDivElement, HTMLDivElement>({
    size,
    count,
    horizontal,
    overscan: 30,
    onResize: event => console.log('onResize:', event),
    onScroll: event => console.log('onScroll:', event),
    onReachEnd: event => console.log('onReachEnd:', event)
  });

  const onClick = useCallback(() => {
    setHorizontal(horizontal => !horizontal);
  }, []);

  const onScrollToItem = useCallback(() => {
    const index = (Math.random() * count) | 0;

    scrollToItem(
      {
        index,
        smooth: false,
        align: 'center'
      },
      () => {
        console.log('scrollToItem:', index, 'done');
      }
    );
  }, []);

  return (
    <>
      <div ref={viewportRef} className={`${styles.viewport} ${horizontal ? styles.horizontal : styles.vertical}`}>
        <div role="list" ref={listRef} className={styles.frame}>
          {items.map(item => (
            <VirtualItem key={item.index} item={item} horizontal={horizontal} />
          ))}
        </div>
      </div>
      <Space className={styles.action}>
        <Button type="primary" onClick={onScrollToItem}>
          滚动到随机索引
        </Button>
        <Button type="primary" onClick={onClick}>
          切换虚列表方向
        </Button>
      </Space>
    </>
  );
};

const ErrorFallback = memo(function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (__DEV__) {
    return (
      <Result
        status="error"
        title="页面错误"
        extra={
          <Button type="primary" onClick={resetErrorBoundary}>
            重试页面
          </Button>
        }
        subTitle={
          <div style={{ display: 'flex', margin: '24px 0 0', justifyContent: 'center' }}>
            <pre style={{ fontFamily: 'monospace', color: '#f00', padding: 0, margin: 0, textAlign: 'left' }}>
              {error.stack}
            </pre>
          </div>
        }
      />
    );
  }

  return (
    <Result
      status="error"
      title="页面错误"
      extra={
        <Button type="primary" onClick={resetErrorBoundary}>
          重试页面
        </Button>
      }
      subTitle="抱歉，发生错误，无法渲染页面，请联系系统管理员或者重试页面！"
    />
  );
});

export default memo(function App(): React.ReactElement {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={styles.app}>
        <VirtualList />
      </div>
    </ErrorBoundary>
  );
});
