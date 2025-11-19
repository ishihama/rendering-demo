import React, { useState } from 'react';
import { 
  Globe, 
  Server, 
  RefreshCw, 
  Layout, 
  Coffee, 
  ShoppingCart, 
  User, 
  Smartphone, 
  Zap, 
  MousePointerClick,
  FileCode // SSG用に追加
} from 'lucide-react';

// カードコンポーネントのProps型定義
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// 共通のスタイルコンポーネント
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
    {children}
  </div>
);

// レンダリングモードの型定義 (SSGを追加)
type RenderMode = 'mpa' | 'spa' | 'ssr' | 'ssg';
type PageType = 'home' | 'about' | 'products';

export default function RenderingComparison() {
  // Stateに型を指定
  const [mode, setMode] = useState<RenderMode>('mpa');
  const [page, setPage] = useState<PageType>('home');
  
  // シミュレーション用ステート
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(false); // 初回ロード中か
  const [isNavigating, setIsNavigating] = useState<boolean>(false);     // ページ遷移中か
  const [whiteOut, setWhiteOut] = useState<boolean>(false);             // 画面を白くするか（MPA用）

  // 初回アクセス（リロード）のシミュレーション
  const reloadPage = () => {
    setPage('home');
    setIsInitialLoading(true);
    
    // 各モードの初期ロード挙動
    if (mode === 'mpa') {
      // MPA: サーバーへ取りに行くため真っ白になる
      setWhiteOut(true);
      setTimeout(() => {
        setWhiteOut(false);
        setIsInitialLoading(false);
      }, 1000);
    } else if (mode === 'spa') {
      // SPA: 空のHTMLが来てからJSで描画するため、最初はスピナーが出る
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 1500); // JSダウンロードと実行で少し遅い
    } else if (mode === 'ssr') {
      // SSR: 完成したHTMLが来るため、表示が速い
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 600); // サーバー処理のみで速い
    } else if (mode === 'ssg') {
      // SSG: 事前に作られたHTMLをCDNから返すため、最も速い
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 300); // 爆速
    }
  };

  // ページ遷移のシミュレーション
  const navigateTo = (targetPage: PageType) => {
    if (page === targetPage) return;

    if (mode === 'mpa') {
      // MPA: 遷移のたびに真っ白（リロード）
      setWhiteOut(true);
      setTimeout(() => {
        setPage(targetPage);
        setWhiteOut(false);
      }, 800);
    } else if (mode === 'ssg') {
      // SSG: 事前生成済みなので即座に表示（ローディングなし）
      setPage(targetPage);
    } else {
      // SPA & SSR: APIでデータ取得するラグを再現
      setIsNavigating(true);
      setPage(targetPage);
      setTimeout(() => {
        setIsNavigating(false);
      }, 400);
    }
  };

  // コンテンツのレンダリング
  const renderContent = () => {
    // Modern方式の遷移中のローディング表示（データ取得中）
    // SSGの場合はnavigateToでisNavigatingがtrueにならないためここは通らない
    if ((mode !== 'mpa') && isNavigating) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 animate-pulse">
          <RefreshCw className="w-8 h-8 animate-spin mb-2" />
          <p>データ取得中...</p>
        </div>
      );
    }

    // SPAの初期ロード中のスピナー
    if (mode === 'spa' && isInitialLoading) {
       return (
        <div className="h-full flex flex-col items-center justify-center text-indigo-500">
          <RefreshCw className="w-10 h-10 animate-spin mb-4" />
          <p className="text-sm font-bold">ブラウザで画面を作成中...</p>
          <p className="text-xs text-slate-400 mt-2">JavaScript Download & Execution</p>
        </div>
      );
    }

    // MPAのホワイトアウト（またはSSR/SSGの初期サーバー待ち）
    if (isInitialLoading || whiteOut) {
      return null; // 何も表示されない
    }

    switch (page) {
      case 'home':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`h-32 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md ${
              mode === 'mpa' ? 'bg-slate-600' : 
              mode === 'spa' ? 'bg-indigo-500' : 
              mode === 'ssr' ? 'bg-emerald-500' : 'bg-orange-500'
            }`}>
              トップページ
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-slate-100 rounded-lg p-4">
                <div className={`w-12 h-12 bg-white rounded-full mb-2 flex items-center justify-center ${
                  mode === 'mpa' ? 'text-slate-600' : 
                  mode === 'spa' ? 'text-indigo-500' : 
                  mode === 'ssr' ? 'text-emerald-500' : 'text-orange-500'
                }`}>
                  <Coffee size={20} />
                </div>
                <div className="text-sm font-bold text-slate-700">カフェ特集</div>
              </div>
              <div className="h-24 bg-slate-100 rounded-lg p-4">
                <div className={`w-12 h-12 bg-white rounded-full mb-2 flex items-center justify-center ${
                  mode === 'mpa' ? 'text-slate-600' : 
                  mode === 'spa' ? 'text-indigo-500' : 
                  mode === 'ssr' ? 'text-emerald-500' : 'text-orange-500'
                }`}>
                  <Layout size={20} />
                </div>
                <div className="text-sm font-bold text-slate-700">新着記事</div>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              レンダリング方式によって「最初の表示速度」や「ページ切り替えの体験」が異なります。Step 1〜3の順に操作して違いを確認してください。
            </p>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`h-32 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md ${
              mode === 'mpa' ? 'bg-slate-500' : 
              mode === 'spa' ? 'bg-indigo-400' : 
              mode === 'ssr' ? 'bg-emerald-400' : 'bg-orange-400'
            }`}>
              会社概要
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">ミッション</h3>
              <p className="text-slate-600 text-sm">
                テクノロジーで世界を変える。ユーザー体験を第一に考え、最高のパフォーマンスを提供します。
              </p>
            </div>
          </div>
        );
      case 'products':
        return (
           <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`h-32 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md ${
               mode === 'mpa' ? 'bg-slate-400' : 
               mode === 'spa' ? 'bg-indigo-300' : 
               mode === 'ssr' ? 'bg-emerald-300' : 'bg-orange-300'
            }`}>
              商品一覧
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-slate-200 rounded-md mr-4"></div>
                  <div>
                    <div className="font-bold text-slate-700">素敵な商品 {i}</div>
                    <div className="text-xs text-slate-500">¥1,200</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 修正: 未使用のヘルパー関数と変数を削除しました
  // const getModeColorClass = ... 
  // const currentColor = ...

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* ヘッダー解説エリア */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">レンダリング方式による体験の違い</h1>
          <p className="text-slate-600">
            以下の手順で、MPA・SPA・SSR・SSGの動きを比較してください
          </p>
        </div>

        {/* モード切替タブ */}
        <div className="flex flex-col items-center mb-8">
          {/* Step 1 ガイド */}
          <div className="mb-2 flex items-center gap-2 animate-pulse">
            {/* Step 1の色を変更：Slate-800 (黒系) */}
            <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-slate-600 flex items-center gap-1">
              <MousePointerClick size={14} />
              Step 1: モードを選択
            </div>
            <div className="text-slate-400 text-xs">↓</div>
          </div>

          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex flex-wrap justify-center gap-2">
            {/* MPA Button */}
            <button
              onClick={() => setMode('mpa')}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 min-w-[140px] cursor-pointer relative ${
                mode === 'mpa'
                  ? 'bg-slate-700 text-white shadow-md scale-100 ring-2 ring-slate-200 ring-offset-2'
                  : 'text-slate-500 hover:bg-slate-50 hover:shadow-sm hover:-translate-y-0.5 border border-transparent hover:border-slate-100'
              }`}
            >
              <Server size={18} />
              <div className="text-left">
                <div>MPA</div>
                <div className="text-[10px] font-normal opacity-80">従来型 (Legacy)</div>
              </div>
              {mode === 'mpa' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">Selected</div>
              )}
            </button>

            {/* SPA Button */}
            <button
              onClick={() => setMode('spa')}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 min-w-[140px] cursor-pointer relative ${
                mode === 'spa'
                  ? 'bg-indigo-600 text-white shadow-md scale-100 ring-2 ring-indigo-200 ring-offset-2'
                  : 'text-slate-500 hover:bg-indigo-50 hover:shadow-sm hover:-translate-y-0.5 border border-transparent hover:border-indigo-100'
              }`}
            >
              <Smartphone size={18} />
              <div className="text-left">
                <div>SPA (CSR)</div>
                <div className="text-[10px] font-normal opacity-80">ブラウザ完結型</div>
              </div>
               {mode === 'spa' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">Selected</div>
              )}
            </button>

            {/* SSR Button */}
            <button
              onClick={() => setMode('ssr')}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 min-w-[140px] cursor-pointer relative ${
                mode === 'ssr'
                  ? 'bg-emerald-600 text-white shadow-md scale-100 ring-2 ring-emerald-200 ring-offset-2'
                  : 'text-slate-500 hover:bg-emerald-50 hover:shadow-sm hover:-translate-y-0.5 border border-transparent hover:border-emerald-100'
              }`}
            >
              <Zap size={18} />
              <div className="text-left">
                <div>SSR</div>
                <div className="text-[10px] font-normal opacity-80">サーバー生成型</div>
              </div>
               {mode === 'ssr' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">Selected</div>
              )}
            </button>

            {/* SSG Button (New) */}
            <button
              onClick={() => setMode('ssg')}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 min-w-[140px] cursor-pointer relative ${
                mode === 'ssg'
                  ? 'bg-orange-500 text-white shadow-md scale-100 ring-2 ring-orange-200 ring-offset-2'
                  : 'text-slate-500 hover:bg-orange-50 hover:shadow-sm hover:-translate-y-0.5 border border-transparent hover:border-orange-100'
              }`}
            >
              <FileCode size={18} />
              <div className="text-left">
                <div>SSG</div>
                <div className="text-[10px] font-normal opacity-80">事前ビルド型</div>
              </div>
               {mode === 'ssg' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">Selected</div>
              )}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* 左側：解説とステータス */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 選択中のモードの詳細解説 */}
            <Card className={`border-t-4 transition-colors duration-300 ${
              mode === 'mpa' ? 'border-t-slate-600' : 
              mode === 'spa' ? 'border-t-indigo-500' : 
              mode === 'ssr' ? 'border-t-emerald-500' : 'border-t-orange-500'
            }`}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                {mode === 'mpa' && 'MPA (Multi-Page Application)'}
                {mode === 'spa' && 'SPA (Single Page Application / CSR)'}
                {mode === 'ssr' && 'SSR (Server-Side Rendering)'}
                {mode === 'ssg' && 'SSG (Static Site Generation)'}
              </h2>
              
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-bold text-slate-700 mb-1">特徴</div>
                  <p className="text-slate-600 leading-relaxed">
                    {mode === 'mpa' && 'ページ遷移のたびにサーバーから新しいHTMLを丸ごと読み込み直します。最も伝統的でシンプルな仕組みです。'}
                    {mode === 'spa' && '最初に「空のHTML」と「JS」を読み込み、ブラウザ上で画面を組み立てます。一度読み込めばサクサク動きますが、最初は待たされます。'}
                    {mode === 'ssr' && 'サーバー上で「完成したHTML」を作ってから送ります。SPAの快適な操作性と、MPAの初期表示の速さ(SEO)を両立します。'}
                    {mode === 'ssg' && 'ビルド時に「HTML」を完全に作っておき、CDNから配信します。SSRよりもさらに初期表示が高速ですが、リアルタイムなデータ反映には工夫が必要です。'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs font-bold text-slate-500 mb-1">初期表示 (First Load)</div>
                    <div className="font-bold text-slate-800">
                      {mode === 'mpa' && '普通'}
                      {mode === 'spa' && '遅い (JS実行待ち)'}
                      {mode === 'ssr' && '速い (HTML到着済)'}
                      {mode === 'ssg' && '爆速 (事前生成済)'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-xs font-bold text-slate-500 mb-1">ページ遷移</div>
                    <div className="font-bold text-slate-800">
                      {mode === 'mpa' && '遅い (全リロード)'}
                      {mode === 'spa' && '速い (部分的更新)'}
                      {mode === 'ssr' && '速い (部分的更新)'}
                      {mode === 'ssg' && '爆速 (ローディング無)'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                     <div className="text-xs font-bold text-slate-500 mb-1">SEO (検索順位)</div>
                    <div className="font-bold text-slate-800">
                      {mode === 'mpa' && '強い'}
                      {mode === 'spa' && '工夫が必要'}
                      {mode === 'ssr' && '強い'}
                      {mode === 'ssg' && '最強'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                     <div className="text-xs font-bold text-slate-500 mb-1">サーバー負荷</div>
                    <div className="font-bold text-slate-800">
                      {mode === 'mpa' && '低い'}
                      {mode === 'spa' && '低い (APIのみ)'}
                      {mode === 'ssr' && '高い (HTML生成)'}
                      {mode === 'ssg' && '極小 (静的配信)'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* サーバーとの会話イメージ */}
            <Card>
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">サーバーとのやりとり</h3>
              <div className="font-mono text-xs space-y-3">
                {mode === 'mpa' && (
                  <>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「トップページをください」</span>
                    </div>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-green-600 font-bold">Server:</span>
                      <span>「HTMLを作りました。どうぞ（全送付）」</span>
                    </div>
                    <div className="border-t border-slate-100 my-2"></div>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「次は会社概要をください」</span>
                    </div>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-green-600 font-bold">Server:</span>
                      <span>「HTMLを作りました。どうぞ（また全送付）」</span>
                    </div>
                  </>
                )}
                {mode === 'spa' && (
                  <>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「サイトを開きたいです」</span>
                    </div>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-green-600 font-bold">Server:</span>
                      <span>「空のHTMLとJSを送ります。後は自分で描いてね」</span>
                    </div>
                    <div className="flex gap-2 text-amber-600 font-bold">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「(JS実行中...クルクル...) 描画完了！」</span>
                    </div>
                    <div className="border-t border-slate-100 my-2"></div>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「会社概要のデータだけちょーだい」</span>
                    </div>
                  </>
                )}
                {mode === 'ssr' && (
                  <>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「サイトを開きたいです」</span>
                    </div>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-green-600 font-bold">Server:</span>
                      <span>「(サーバー側で描画完了) 完成品のHTMLを送ります！」</span>
                    </div>
                    <div className="flex gap-2 text-emerald-600 font-bold">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「すぐ表示できました！」</span>
                    </div>
                    <div className="border-t border-slate-100 my-2"></div>
                     <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「次は会社概要のデータだけちょーだい」</span>
                    </div>
                  </>
                )}
                {mode === 'ssg' && (
                  <>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「サイトを開きたいです」</span>
                    </div>
                    <div className="flex gap-2 text-slate-700">
                      <span className="text-orange-600 font-bold">CDN:</span>
                      <span>「作っておいたHTMLがあります！どうぞ！（即答）」</span>
                    </div>
                    <div className="flex gap-2 text-orange-600 font-bold">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「一瞬で表示できました！」</span>
                    </div>
                    <div className="border-t border-slate-100 my-2"></div>
                     <div className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">Browser:</span>
                      <span>「次は会社概要のページ（事前生成済）をください」</span>
                    </div>
                    <div className="flex gap-2 text-orange-600 font-bold">
                      <span className="text-blue-600 font-bold">CDN:</span>
                      <span>「はい、どうぞ！（即答）」</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* 右側：ブラウザシミュレーター */}
          <div className="lg:col-span-7">
            <div className="relative">

              {/* ブラウザウィンドウの枠 */}
              <div className="bg-slate-800 rounded-t-xl p-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                {/* アドレスバー＆リロードボタン */}
                <div className="relative flex-1 bg-slate-700 rounded flex items-center px-2">
                   {/* 初期表示（リロード）のアクションガイド */}
                  <div className="absolute -top-12 left-0 w-max
                                text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-1.5 rounded shadow-lg
                                flex items-center gap-2 animate-bounce z-10">
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-yellow-400 rotate-45"></div>
                    <span>Step 2: リロードで初期表示を比較</span>
                  </div>

                  <button 
                    onClick={reloadPage}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-600 rounded-full transition-colors cursor-pointer"
                    title="ページを再読み込み (初期ロードのテスト)"
                  >
                    <RefreshCw size={14} className={isInitialLoading ? "animate-spin" : ""} />
                  </button>
                  <div className="flex-1 px-2 py-1.5 text-xs text-slate-300 font-mono truncate">
                    example.com/{page}
                  </div>
                </div>
              </div>

              {/* ビューポート（画面表示領域） */}
              <div className="bg-white h-[500px] rounded-b-xl border-x border-b border-slate-200 shadow-xl overflow-hidden relative flex flex-col">
                
                {/* MPA用: ホワイトアウトレイヤー */}
                {whiteOut && (
                  <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
                  </div>
                )}

                {/* ナビゲーションバー */}
                <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shrink-0 relative">
                   
                  {/* ページ遷移（ナビゲーション）のアクションガイド */}
                  {/* Step 3の色を変更：Blue-600 (青) */}
                   <div className="absolute top-16 left-1/2 -translate-x-1/2 w-max z-20
                                text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg
                                flex items-center gap-2 animate-bounce pointer-events-none opacity-90">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
                    <span>Step 3: メニューで遷移を比較</span>
                  </div>

                  <div className={`font-bold text-xl flex items-center gap-2 ${
                    mode === 'mpa' ? 'text-slate-700' : 
                    mode === 'spa' ? 'text-indigo-600' : 
                    mode === 'ssr' ? 'text-emerald-600' : 'text-orange-600'
                  }`}>
                    <Globe className="w-6 h-6" />
                    <span>DemoSite</span>
                  </div>
                  <nav className="flex gap-1">
                    <button 
                      onClick={() => navigateTo('home')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${page === 'home' ? 'bg-slate-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      ホーム
                    </button>
                    <button 
                      onClick={() => navigateTo('about')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${page === 'about' ? 'bg-slate-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      会社概要
                    </button>
                    <button 
                      onClick={() => navigateTo('products')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${page === 'products' ? 'bg-slate-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      商品
                    </button>
                  </nav>
                  <div className="flex gap-2 text-slate-400">
                    <ShoppingCart size={20} />
                    <User size={20} />
                  </div>
                </header>

                {/* メインコンテンツエリア */}
                <main className="flex-1 p-6 overflow-y-auto bg-slate-50/50 relative">
                  {renderContent()}
                </main>
                
              </div>
            </div>
            
            <p className="mt-4 text-center text-xs text-slate-400">
              ※ まず「Step 1」でモードを切り替えてから、Step 2, 3をお試しください。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
