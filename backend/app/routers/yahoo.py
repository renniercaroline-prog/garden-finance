from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
import yfinance as yf
from pydantic import BaseModel

router = APIRouter(prefix="/yahoo", tags=["Yahoo Finance"])


class StockQuote(BaseModel):
    symbol: str
    current_price: float
    change: float
    change_percent: float
    open: float
    high: float
    low: float
    volume: int
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None


class HistoricalDataPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class StockInfo(BaseModel):
    symbol: str
    name: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    dividend_yield: Optional[float] = None


@router.get("/quote/{symbol}", response_model=StockQuote)
async def get_stock_quote(symbol: str):
    """
    Get real-time stock quote for a given symbol.
    Example: /yahoo/quote/AAPL
    """
    try:
        ticker = yf.Ticker(symbol.upper())
        info = ticker.info
        
        # Get current price and calculate change
        current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
        previous_close = info.get('previousClose', current_price)
        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close else 0
        
        return StockQuote(
            symbol=symbol.upper(),
            current_price=current_price,
            change=change,
            change_percent=change_percent,
            open=info.get('open', 0) or info.get('regularMarketOpen', 0),
            high=info.get('dayHigh', 0) or info.get('regularMarketDayHigh', 0),
            low=info.get('dayLow', 0) or info.get('regularMarketDayLow', 0),
            volume=info.get('volume', 0) or info.get('regularMarketVolume', 0),
            market_cap=info.get('marketCap'),
            pe_ratio=info.get('trailingPE') or info.get('forwardPE'),
            fifty_two_week_high=info.get('fiftyTwoWeekHigh'),
            fifty_two_week_low=info.get('fiftyTwoWeekLow')
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Could not fetch data for {symbol}: {str(e)}")


@router.get("/quotes", response_model=List[StockQuote])
async def get_multiple_quotes(symbols: str = Query(..., description="Comma-separated list of symbols")):
    """
    Get real-time quotes for multiple stocks.
    Example: /yahoo/quotes?symbols=AAPL,MSFT,GOOGL
    """
    symbol_list = [s.strip().upper() for s in symbols.split(',')]
    quotes = []
    
    for symbol in symbol_list:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
            previous_close = info.get('previousClose', current_price)
            change = current_price - previous_close
            change_percent = (change / previous_close * 100) if previous_close else 0
            
            quotes.append(StockQuote(
                symbol=symbol,
                current_price=current_price,
                change=change,
                change_percent=change_percent,
                open=info.get('open', 0) or info.get('regularMarketOpen', 0),
                high=info.get('dayHigh', 0) or info.get('regularMarketDayHigh', 0),
                low=info.get('dayLow', 0) or info.get('regularMarketDayLow', 0),
                volume=info.get('volume', 0) or info.get('regularMarketVolume', 0),
                market_cap=info.get('marketCap'),
                pe_ratio=info.get('trailingPE') or info.get('forwardPE'),
                fifty_two_week_high=info.get('fiftyTwoWeekHigh'),
                fifty_two_week_low=info.get('fiftyTwoWeekLow')
            ))
        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            continue
    
    if not quotes:
        raise HTTPException(status_code=404, detail="Could not fetch data for any symbols")
    
    return quotes


@router.get("/history/{symbol}", response_model=List[HistoricalDataPoint])
async def get_historical_data(
    symbol: str,
    period: str = Query("1mo", description="Valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max"),
    interval: str = Query("1d", description="Valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo")
):
    """
    Get historical price data for a stock.
    Example: /yahoo/history/AAPL?period=1mo&interval=1d
    """
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No historical data found for {symbol}")
        
        data_points = []
        for index, row in hist.iterrows():
            data_points.append(HistoricalDataPoint(
                date=index.strftime('%Y-%m-%d'),
                open=float(row['Open']),
                high=float(row['High']),
                low=float(row['Low']),
                close=float(row['Close']),
                volume=int(row['Volume'])
            ))
        
        return data_points
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")


@router.get("/info/{symbol}", response_model=StockInfo)
async def get_stock_info(symbol: str):
    """
    Get detailed company information for a stock.
    Example: /yahoo/info/AAPL
    """
    try:
        ticker = yf.Ticker(symbol.upper())
        info = ticker.info
        
        return StockInfo(
            symbol=symbol.upper(),
            name=info.get('longName', symbol.upper()),
            sector=info.get('sector'),
            industry=info.get('industry'),
            description=info.get('longBusinessSummary'),
            website=info.get('website'),
            market_cap=info.get('marketCap'),
            pe_ratio=info.get('trailingPE') or info.get('forwardPE'),
            dividend_yield=info.get('dividendYield')
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Could not fetch info for {symbol}: {str(e)}")


@router.get("/trending")
async def get_trending_stocks():
    """
    Get a list of trending/popular stocks.
    Returns major market indices and popular stocks.
    """
    popular_symbols = [
        "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", 
        "META", "NVDA", "JPM", "V", "WMT"
    ]
    
    quotes = []
    for symbol in popular_symbols:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
            previous_close = info.get('previousClose', current_price)
            change = current_price - previous_close
            change_percent = (change / previous_close * 100) if previous_close else 0
            
            quotes.append({
                "symbol": symbol,
                "name": info.get('longName', symbol),
                "price": current_price,
                "change": change,
                "change_percent": change_percent
            })
        except:
            continue
    
    return {"trending": quotes}


@router.get("/search/{query}")
async def search_stocks(query: str):
    """
    Search for stocks by name or symbol.
    Note: This is a simple implementation using common stock symbols.
    For production, consider using a dedicated search API.
    """
    # For a basic implementation, we'll try to fetch the ticker
    # In production, you'd want to use a proper search API
    try:
        ticker = yf.Ticker(query.upper())
        info = ticker.info
        
        if info.get('regularMarketPrice') or info.get('currentPrice'):
            return {
                "results": [{
                    "symbol": query.upper(),
                    "name": info.get('longName', query.upper()),
                    "type": info.get('quoteType', 'EQUITY'),
                    "exchange": info.get('exchange', 'Unknown')
                }]
            }
        else:
            return {"results": []}
    except:
        return {"results": []}

